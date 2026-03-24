/**
 * Smart Value - AI Valuation Engine
 *
 * Architecture: Tavily Search (real-time web data) + Azure OpenAI (AI analysis)
 * - Tavily: Free 1,000 searches/month, returns clean AI-ready content
 * - Azure OpenAI: $200 free credits, GPT-4o analysis
 */

import { z } from "zod";

// ─── Zod Schema for AI Response Validation ────────────────────────

const ComparableSaleSchema = z.object({
  address: z.string(),
  price: z.number(),
  date: z.string(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.number(),
});

const ValuationResponseSchema = z.object({
  estimatedValueLow: z.number(),
  estimatedValueHigh: z.number(),
  estimatedValue: z.number(),
  appreciationRate: z.number(),
  propertyDetails: z.object({
    beds: z.number(),
    baths: z.number(),
    sqft: z.number(),
    yearBuilt: z.number(),
    lotSize: z.string(),
    propertyType: z.string(),
  }),
  comparableSales: z.array(ComparableSaleSchema).min(1),
  schoolRating: z.number().min(0).max(10),
  neighborhoodTrend: z.enum(["rising", "stable", "declining"]),
  marketSummary: z.string().min(10),
});

// ─── Tavily Search ────────────────────────────────────────────────

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  answer?: string;
  results: TavilyResult[];
}

async function searchPropertyData(address: string): Promise<TavilyResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY not configured");
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query: `${address} home value price property details zillow redfin realtor`,
      search_depth: "advanced",
      include_answer: true,
      max_results: 5,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.status}`);
  }

  return response.json();
}

// ─── Azure OpenAI Analysis ────────────────────────────────────────

function buildPromptWithSearchData(
  address: string,
  searchData: TavilyResponse,
  locale: string
): string {
  const searchContext = searchData.results
    .map(
      (r, i) =>
        `[Source ${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}`
    )
    .join("\n\n---\n\n");

  const tavilyAnswer = searchData.answer
    ? `\nTavily AI Summary:\n${searchData.answer}\n`
    : "";

  const summaryLang =
    locale === "zh"
      ? "marketSummary must be in Chinese (简体中文)."
      : "marketSummary must be in English.";

  return `Based on REAL web search results, provide a home valuation for: ${address}

${tavilyAnswer}
=== SEARCH RESULTS (use these as your data source) ===

${searchContext}

=== END SEARCH RESULTS ===

Analyze the search results above and extract real property data. Use the actual data found in the search results for your valuation.

Respond with ONLY a valid JSON object in this exact format:
{
  "estimatedValueLow": <number>,
  "estimatedValueHigh": <number>,
  "estimatedValue": <number>,
  "appreciationRate": <number, e.g. 5.2>,
  "propertyDetails": {
    "beds": <number>,
    "baths": <number>,
    "sqft": <number>,
    "yearBuilt": <number>,
    "lotSize": "<string>",
    "propertyType": "<string>"
  },
  "comparableSales": [
    {
      "address": "<string>",
      "price": <number>,
      "date": "<month year>",
      "beds": <number>,
      "baths": <number>,
      "sqft": <number>
    }
  ],
  "schoolRating": <number 1-10>,
  "neighborhoodTrend": "<rising|stable|declining>",
  "marketSummary": "<2-3 sentences>"
}

Rules:
- Use REAL data from the search results above. Do NOT make up values.
- If a specific value is not found, provide a reasonable estimate based on area data and note it.
- Provide exactly 3 comparable sales.
- All monetary values in USD.
- ${summaryLang}
- Respond ONLY with the JSON object, no other text.`;
}

const SYSTEM_PROMPT = `You are an expert real estate appraiser AI. You analyze real web search data to produce accurate property valuations. Always base your analysis on the provided search results rather than general knowledge. Be precise with numbers and cite data from the search results when possible.`;

async function analyzeWithAzureOpenAI(
  address: string,
  searchData: TavilyResponse,
  locale: string
) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";

  if (!endpoint || !apiKey) {
    throw new Error(
      "Azure OpenAI credentials not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY."
    );
  }

  const userPrompt = buildPromptWithSearchData(address, searchData, locale);

  const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000); // 30s timeout

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Azure OpenAI API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from Azure OpenAI");
    }

    // Parse and validate with Zod
    const parsed = JSON.parse(content);
    const validated = ValuationResponseSchema.parse(parsed);
    return validated;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Main Entry Point ─────────────────────────────────────────────

export async function generateValuation(
  address: string,
  locale: string = "en"
) {
  try {
    // Step 1: Search for real property data via Tavily
    console.log(`[Valuation] Searching Tavily for: ${address}`);
    const searchData = await searchPropertyData(address);
    console.log(
      `[Valuation] Got ${searchData.results.length} search results`
    );

    // Step 2: Analyze with Azure OpenAI (with Zod validation)
    console.log(`[Valuation] Analyzing with Azure OpenAI...`);
    const result = await analyzeWithAzureOpenAI(address, searchData, locale);

    return {
      success: true as const,
      data: result,
      model: `azure-${process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o"}+tavily`,
      sources: searchData.results.map((r) => ({
        title: r.title,
        url: r.url,
      })),
    };
  } catch (error) {
    console.error("Valuation error:", error);

    // Distinguish different error types for the client
    let errorCode = "VALUATION_FAILED";
    if (error instanceof Error) {
      if (error.name === "AbortError") errorCode = "TIMEOUT";
      else if (error.message.includes("not configured")) errorCode = "CONFIG_ERROR";
      else if (error.message.includes("Tavily")) errorCode = "SEARCH_FAILED";
      else if (error.message.includes("Azure")) errorCode = "AI_FAILED";
      else if (error.name === "ZodError") errorCode = "INVALID_AI_RESPONSE";
    }

    return {
      success: false as const,
      errorCode,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
