# 🏠 Smart Value — AI Home Valuation Lead Magnet

[![Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **为房产经纪人打造的 AI 免费估价工具，精准捕获 Seller Leads。**
>
> 用户输入地址 → AI 实时分析公开房产数据 → 生成专业估价报告 → 邮箱捕获转化为 Lead。
> 每次估值成本仅 ~$0.01，对比竞品 $400–1,000/月的订阅费，降本 99%。

---

## ✨ 核心功能

- 🔍 **AI 实时估值** — Tavily 搜索 Zillow/Redfin/公共记录 + GPT-4o 智能分析，60 秒出报告
- 📊 **专业报告** — 房屋详情 / 成交对比 (Comps) / 学区评分 / 市场趋势，一键生成
- 📧 **Lead 自动捕获** — 邮箱收集 → PostgreSQL 存储，经纪人后台即时查看
- 💬 **AI Chat Widget** — 估值完成后弹出智能对话提示，引导用户深度互动
- 🌙 **Glassmorphism 暗色主题** — 动画驱动的沉浸式 UI，提升品牌质感

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

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | Next.js 16 · React 19 · TypeScript 5          |
| Styling    | TailwindCSS 4 · Glassmorphism dark theme      |
| Animation  | Framer Motion                                 |
| Icons      | Lucide React                                  |
| Search     | Tavily API (免费 1,000 次/月)                  |
| AI         | Azure OpenAI GPT-4o ($200 免费额度)            |
| Database   | PostgreSQL · Drizzle ORM                       |
| Validation | Zod                                            |

---

## 🚀 Quick Start

### 1. 安装依赖

```bash
git clone https://github.com/Kevv-AI-Labs-Inc/housevaluesellerleads.git
cd housevaluesellerleads
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local  # 或手动创建
```

```bash
# Tavily Search — https://tavily.com 注册免费 API Key
TAVILY_API_KEY=tvly-xxx

# Azure OpenAI — Azure Portal 创建 OpenAI 资源
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# PostgreSQL (可选 — 不配置则 Lead 输出到 console)
DATABASE_URL=postgresql://user:password@localhost:5432/smartvalue
```

### 3. 数据库初始化 (可选)

```bash
pnpm drizzle-kit push    # 同步 Drizzle Schema → PostgreSQL
```

### 4. 启动开发服务器

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
