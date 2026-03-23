# Smart Value — AI 房屋估值 Lead Magnet

> 经纪人专属的 AI 免费估价工具，用于捕获 seller leads。

## 🏗 Architecture

```
用户输入地址
  → Tavily Search  (实时搜索 Zillow/Redfin/county records)
  → Azure OpenAI   (GPT-4o 分析真实数据，生成估值报告)
  → Lead 存入 PostgreSQL
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · React 19 · TypeScript |
| Styling | TailwindCSS 4 · Glassmorphism dark theme |
| Animation | Framer Motion |
| Search | Tavily API (免费 1,000 次/月) |
| AI | Azure OpenAI GPT-4o ($200 免费额度) |
| Database | PostgreSQL · Drizzle ORM |

## Quick Start

```bash
pnpm install
# 配置 .env.local (见下方)
pnpm dev       # → http://localhost:3000
```

### Environment Variables

```bash
# Tavily Search — https://tavily.com 注册
TAVILY_API_KEY=tvly-xxx

# Azure OpenAI — Azure Portal 创建资源
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/smartvalue
```

### Database Setup

```bash
pnpm drizzle-kit push    # 同步 schema 到 PostgreSQL
```

---

## 📋 Roadmap

### Phase 1 — MVP ✅ (当前)
- [x] AI 估值引擎 (Tavily + Azure OpenAI)
- [x] 地址输入 → 估值报告页面
- [x] 邮箱捕获 Lead → PostgreSQL
- [x] AI Chat Widget 提示
- [x] 深色 Glassmorphism UI

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

## 竞品对标

| vs | 我们的优势 |
|---|---|
| SmartZip | AI 原生、零 AVM 维护、成本极低 |
| Offrs | 无 6 个月合约、中文优先、Kevv 生态整合 |
| 两者 | 每次估值 ~$0.01 vs 对手 $400-1000/月 |

## License

Private — Kevv AI
