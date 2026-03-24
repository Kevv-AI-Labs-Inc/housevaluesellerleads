export type Locale = "zh" | "en";

export const translations = {
  // ─── Header ────────────────────────────────────────────
  "header.badge": {
    zh: "AI 驱动 · 免费估价",
    en: "AI-Powered · Free Valuation",
  },

  // ─── Hero / Input ──────────────────────────────────────
  "hero.title1": {
    zh: "您的房子",
    en: "What's Your Home",
  },
  "hero.title2": {
    zh: "现在值多少？",
    en: "Really Worth?",
  },
  "hero.subtitle": {
    zh: "输入地址，AI 即刻分析公开数据，为您生成专业级房屋估价报告",
    en: "Enter your address and get a professional AI-powered home valuation report in 60 seconds",
  },
  "input.label": {
    zh: "输入房屋地址",
    en: "Enter Property Address",
  },
  "input.sublabel": {
    zh: "支持美国所有地区",
    en: "All US regions supported",
  },
  "input.placeholder": {
    zh: "例如: 123 Main St, Flushing, NY 11355",
    en: "e.g. 123 Main St, Flushing, NY 11355",
  },
  "input.error.required": {
    zh: "请输入完整的房屋地址",
    en: "Please enter a complete property address",
  },
  "input.button": {
    zh: "免费 AI 估价",
    en: "Free AI Valuation",
  },
  "input.feature.market": {
    zh: "市场分析",
    en: "Market Analysis",
  },
  "input.feature.comps": {
    zh: "成交对比",
    en: "Comparable Sales",
  },
  "input.feature.school": {
    zh: "学区评分",
    en: "School Rating",
  },
  "trust.free": {
    zh: "完全免费",
    en: "100% Free",
  },
  "trust.fast": {
    zh: "60秒出结果",
    en: "Results in 60s",
  },
  "trust.safe": {
    zh: "数据安全",
    en: "Data Secure",
  },

  // ─── Loading ───────────────────────────────────────────
  "loading.title": {
    zh: "AI 正在分析...",
    en: "AI is Analyzing...",
  },
  "loading.subtitle": {
    zh: "正在搜索 {address} 的公开数据",
    en: "Searching public records for {address}",
  },
  "loading.step1": {
    zh: "搜索税务评估记录...",
    en: "Searching tax assessment records...",
  },
  "loading.step2": {
    zh: "分析近期成交数据...",
    en: "Analyzing recent sales data...",
  },
  "loading.step3": {
    zh: "评估区域市场趋势...",
    en: "Evaluating market trends...",
  },
  "loading.step4": {
    zh: "计算学区评分...",
    en: "Calculating school ratings...",
  },
  "loading.step5": {
    zh: "生成估价报告...",
    en: "Generating valuation report...",
  },

  // ─── Gate (Lead Capture) ───────────────────────────────
  "gate.ready": {
    zh: "您的估价报告已准备好！",
    en: "Your Valuation Report is Ready!",
  },
  "gate.subtitle": {
    zh: "输入您的联系方式，立即查看完整估价报告",
    en: "Enter your contact info to view the full valuation report",
  },
  "gate.estimated": {
    zh: "估算市场价值",
    en: "Estimated Market Value",
  },
  "gate.email.placeholder": {
    zh: "您的邮箱",
    en: "Your email",
  },
  "gate.phone.placeholder": {
    zh: "您的手机号",
    en: "Your phone number",
  },
  "gate.name.placeholder": {
    zh: "您的姓名 (选填)",
    en: "Your name (optional)",
  },
  "gate.button": {
    zh: "查看完整报告",
    en: "View Full Report",
  },
  "gate.privacy": {
    zh: "我们重视您的隐私。您的信息仅用于发送估价报告，绝不会出售给第三方。",
    en: "We respect your privacy. Your information is only used to deliver the valuation report and will never be sold.",
  },
  "gate.error.email": {
    zh: "请输入有效的邮箱地址",
    en: "Please enter a valid email address",
  },
  "gate.error.phone": {
    zh: "请输入有效的手机号码",
    en: "Please enter a valid phone number",
  },

  // ─── Report ────────────────────────────────────────────
  "report.title": {
    zh: "AI 估价报告",
    en: "AI Valuation Report",
  },
  "report.estimatedValue": {
    zh: "估算市场价值",
    en: "Estimated Market Value",
  },
  "report.bestEstimate": {
    zh: "最佳估值",
    en: "Best Estimate",
  },
  "report.appreciation.up": {
    zh: "较去年增值",
    en: "Year-over-Year Growth",
  },
  "report.appreciation.change": {
    zh: "较去年变化",
    en: "Year-over-Year Change",
  },
  "report.schoolRating": {
    zh: "学区评分",
    en: "School Rating",
  },
  "report.propertyInfo": {
    zh: "房屋信息",
    en: "Property Details",
  },
  "report.beds": {
    zh: "卧室",
    en: "Beds",
  },
  "report.baths": {
    zh: "浴室",
    en: "Baths",
  },
  "report.sqft": {
    zh: "面积",
    en: "Area",
  },
  "report.yearBuilt": {
    zh: "建成年份",
    en: "Year Built",
  },
  "report.lotSize": {
    zh: "占地",
    en: "Lot Size",
  },
  "report.propertyType": {
    zh: "类型",
    en: "Type",
  },
  "report.comps": {
    zh: "近期可比成交",
    en: "Recent Comparable Sales",
  },
  "report.marketTrend": {
    zh: "市场趋势分析",
    en: "Market Trend Analysis",
  },
  "report.trend.rising": {
    zh: "📈 上涨",
    en: "📈 Rising",
  },
  "report.trend.stable": {
    zh: "📊 稳定",
    en: "📊 Stable",
  },
  "report.trend.declining": {
    zh: "📉 下降",
    en: "📉 Declining",
  },
  "report.trendLabel": {
    zh: "区域趋势",
    en: "Area Trend",
  },
  "report.unit.rooms": {
    zh: "间",
    en: "",
  },
  "report.newValuation": {
    zh: "估价另一个地址",
    en: "Value Another Property",
  },

  // ─── Share ─────────────────────────────────────────────
  "share.title": {
    zh: "分享估价结果",
    en: "Share This Valuation",
  },
  "share.copy": {
    zh: "复制链接",
    en: "Copy Link",
  },
  "share.copied": {
    zh: "已复制！",
    en: "Copied!",
  },
  "share.whatsapp": {
    zh: "WhatsApp",
    en: "WhatsApp",
  },
  "share.facebook": {
    zh: "Facebook",
    en: "Facebook",
  },
  "share.twitter": {
    zh: "X (Twitter)",
    en: "X (Twitter)",
  },
  "share.wechat": {
    zh: "微信",
    en: "WeChat",
  },

  // ─── Chat Widget ───────────────────────────────────────
  "chat.title": {
    zh: "AI 助手",
    en: "AI Assistant",
  },
  "chat.message": {
    zh: "对估价结果有疑问？需要具体聊聊您的房子吗？💬",
    en: "Have questions about the valuation? Want to discuss your property? 💬",
  },

  // ─── Pricing CTA ───────────────────────────────────────
  "pricing.badge": {
    zh: "经纪人专属",
    en: "For Agents",
  },
  "pricing.title": {
    zh: "用 AI 估价为您获取更多客户",
    en: "Get More Leads with AI Valuations",
  },
  "pricing.subtitle": {
    zh: "为您的品牌定制 AI 估价页面，自动捕获 Seller Leads，每月仅需",
    en: "Get a custom AI valuation page for your brand. Automatically capture seller leads, starting at just",
  },
  "pricing.price": {
    zh: "$49/月",
    en: "$49/mo",
  },
  "pricing.button": {
    zh: "了解更多",
    en: "Learn More",
  },
  "pricing.feature1": {
    zh: "您的品牌 & Logo",
    en: "Your Branding & Logo",
  },
  "pricing.feature2": {
    zh: "Lead 实时通知",
    en: "Real-time Lead Alerts",
  },
  "pricing.feature3": {
    zh: "CRM 集成",
    en: "CRM Integration",
  },

  // ─── Footer ────────────────────────────────────────────
  "footer.disclaimer": {
    zh: "Powered by AI · 估值仅供参考，不构成投资建议",
    en: "Powered by AI · Valuations are estimates only, not investment advice",
  },
  "footer.copyright": {
    zh: "© {year} Smart Value",
    en: "© {year} Smart Value",
  },
} as const;

export type TranslationKey = keyof typeof translations;
