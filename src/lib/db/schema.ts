import {
  pgTable,
  serial,
  varchar,
  text,
  json,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

/** Captured seller leads */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  name: varchar("name", { length: 255 }),
  address: text("address").notNull(),
  agentSlug: varchar("agent_slug", { length: 100 }),
  valuationId: integer("valuation_id"),
  source: varchar("source", { length: 50 }).default("valuation_tool"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** AI valuation history */
export const valuationHistory = pgTable("valuation_history", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  result: json("result").$type<ValuationResult>(),
  modelUsed: varchar("model_used", { length: 100 }),
  agentSlug: varchar("agent_slug", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** TypeScript types for valuation result JSON */
export interface ComparableSale {
  address: string;
  price: number;
  date: string;
  beds: number;
  baths: number;
  sqft: number;
}

export interface ValuationResult {
  estimatedValueLow: number;
  estimatedValueHigh: number;
  estimatedValue: number;
  appreciationRate: number;
  propertyDetails: {
    beds: number;
    baths: number;
    sqft: number;
    yearBuilt: number;
    lotSize: string;
    propertyType: string;
  };
  comparableSales: ComparableSale[];
  schoolRating: number;
  neighborhoodTrend: string;
  marketSummary: string;
  equity?: number;
}
