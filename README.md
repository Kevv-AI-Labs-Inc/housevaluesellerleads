# 🏠 Smart Value — AI Home Valuation Lead Magnet

[![Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **AI-powered free home valuation tool for real estate agents — capture Seller Leads at scale.**
>
> 为房产经纪人打造的 AI 免费估价工具，精准捕获 Seller Leads。
>
> User enters address → AI analyzes public data → Gated report captures email & phone → Agent notified instantly.
> Cost per valuation: ~$0.01 vs competitors at $400–1,000/mo. **99% cost reduction.**

---

## ✨ Features

- 🌐 **Bilingual (EN/中文)** — Native i18n with browser auto-detection and one-click toggle
- 🔍 **AI Real-time Valuation** — Tavily searches Zillow/Redfin/public records + GPT-4o analysis, results in 60s
- 📊 **Professional Report** — Property details, comparable sales, school ratings, market trends
- 🔒 **Lead Gate** — Email + phone required before revealing full report (blurred value preview as teaser)
- 📍 **Google Places Autocomplete** — Standardized US address input, reducing drop-off
- 📲 **Agent Attribution** — `?agent=xxx` URL param tracks lead ownership per agent
- 🔔 **Real-time Notifications** — Email (via Resend) + Webhook alerts when a new lead is captured
- 🔗 **Social Sharing** — WhatsApp, Facebook, Twitter/X, WeChat, Copy Link — with viral attribution
- 💰 **Pricing CTA** — Agent subscription upsell built into every report
- 💬 **AI Chat Widget** — Post-valuation conversation prompt
- 🌙 **Glassmorphism Dark Theme** — Framer Motion animations, immersive premium UI

---

## 🏗 工作原理

```
用户输入地址
  → Tavily Search API   搜索 Zillow / Redfin / 税务记录等公开数据
  → Azure OpenAI GPT-4o  分析真实数据，结构化输出估值报告
  → Lead 存入 PostgreSQL  邮箱 + 地址 + 估值结果持久化
```

**核心优势：不依赖昂贵的 AVM (Automated Valuation Model) 数据源，使用 AI 搜索 + 大模型分析公开数据，实现低成本、高精度估值。**

---

## 🛠 Tech Stack

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| Frontend      | Next.js 16 · React 19 · TypeScript 5          |
| Styling       | TailwindCSS 4 · Glassmorphism dark theme      |
| Animation     | Framer Motion                                 |
| i18n          | Custom context-based (EN / 中文)               |
| Address Input | Google Places Autocomplete (optional)          |
| Search        | Tavily API (free 1,000/mo)                     |
| AI            | Azure OpenAI GPT-4o ($200 free credits)        |
| Database      | PostgreSQL · Drizzle ORM                       |
| Notifications | Resend API (email) · Webhooks                  |
| Validation    | Zod                                            |

---

## 🚀 Quick Start

### 1. 安装依赖

```bash
git clone https://github.com/Kevv-AI-Labs-Inc/housevaluesellerleads.git
cd housevaluesellerleads
pnpm install
```

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local  # or create manually
```

```bash
# Tavily Search — https://tavily.com (free API key)
TAVILY_API_KEY=tvly-xxx

# Azure OpenAI — Create resource in Azure Portal
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# PostgreSQL (optional — leads logged to console if not set)
DATABASE_URL=postgresql://user:password@localhost:5432/smartvalue

# Google Places Autocomplete (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Agent Notification (optional)
AGENT_NOTIFICATION_EMAIL=agent@example.com
RESEND_API_KEY=re_xxx
AGENT_WEBHOOK_URL=https://your-crm.com/webhook
```

### 3. Database Setup (Optional)

```bash
pnpm drizzle-kit push    # Sync Drizzle Schema → PostgreSQL
```

### 4. Start Dev Server

```bash
pnpm dev       # → http://localhost:3000
```

---

## 📂 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── valuation/route.ts   # AI 估值 API (Tavily + Azure OpenAI)
│   │   └── leads/route.ts       # Lead 捕获 API
│   ├── globals.css              # Glassmorphism 主题 + 动画
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # 主页面 (地址输入 → 报告展示)
└── lib/
    ├── ai/
    │   └── valuation.ts         # AI 估值引擎核心逻辑
    └── db/
        ├── index.ts             # Drizzle 数据库连接
        └── schema.ts            # 数据表定义 (leads, valuation_history)
```

---

## 📋 Roadmap

### Phase 1 — MVP ✅ (当前)
- [x] AI 估值引擎 (Tavily + Azure OpenAI)
- [x] 地址输入 → 估值报告页面
- [x] 邮箱捕获 Lead → PostgreSQL
- [x] AI Chat Widget 对话提示
- [x] 深色 Glassmorphism UI + Framer Motion 动画

### Phase 2 — 数据增强 🔜
- [ ] **Zillow Bridge API** — 接入官方 Zestimate + 房屋详情
- [ ] **ATTOM Data API** — 税务评估、成交历史
- [ ] **估值趋势追踪** — 定期重估 + 变化通知邮件
- [ ] **PDF 报告生成** — 品牌化 PDF，通过 Resend API 发送到用户邮箱

### Phase 3 — 经纪人平台
- [ ] **Agent 品牌页** — `/[agent]/valuation`，自定义头像、名片、公司 logo
- [ ] **Agent 注册后台** — 自助创建账号、管理 leads
- [ ] **CRM 集成** — 对接 Kevv CRM 或 webhook 导出到 HubSpot/Follow Up Boss

### Phase 4 — AI 智能跟进
- [ ] **AI 对话跟进** — Chat Widget → 真正的 GPT 对话 (带估值上下文)
- [ ] **Email Drip Campaign** — 自动邮件序列 (Resend API)
- [ ] **SMS 跟进** — Twilio 短信自动触达

### Phase 5 — 卖家预测 (护城河)
- [ ] **卖家意愿评分** — 基于用户行为 + 房屋数据预测卖房概率
- [ ] **pgvector 向量搜索** — 语义化房屋特征匹配
- [ ] **多语言支持** — 英文 + 中文双语界面

---

## 🆚 竞品对标

| vs       | 我们的优势                                           |
| -------- | ---------------------------------------------------- |
| SmartZip | AI 原生架构、零 AVM 维护成本、启动成本接近零          |
| Offrs    | 无 6 个月合约绑定、中文市场优先、Kevv 生态整合       |
| Zillow   | 面向经纪人 Lead Gen 定制，非通用估值工具              |
| **成本** | **每次估值 ~$0.01** vs 对手 $400–1,000/月订阅        |

---

## 🤝 Contributing

欢迎贡献！请 fork 本仓库后提交 Pull Request。

```bash
# 开发流程
pnpm install
pnpm dev          # 本地开发
pnpm build        # 生产构建检查
pnpm lint         # ESLint 代码检查
```

---

## 📄 License

[Apache License 2.0](LICENSE) — [Kevv AI Labs](https://github.com/Kevv-AI-Labs-Inc)

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Kevv-AI-Labs-Inc">Kevv AI Labs</a></sub>
</p>
