# EIDOLON — Autonomous Yield Intelligence on Somnia Agentic L1

> *Build what others call impossible.*

EIDOLON is a fully autonomous DeFi yield optimization agent built on Somnia's Agentic L1 infrastructure. It deploys a composable pipeline of three specialized sub-agents that continuously monitor markets, reason about opportunities, and execute rebalancing transactions — with zero human intervention.

---

## 🏗 Architecture

```
Orchestrator
├── DataAgent       → Fetches block, gas, balances & APYs from Somnia L1
├── DecisionAgent   → Reasons about yield delta, risk, gas cost → REBALANCE | HOLD
└── ExecutorAgent   → Signs & broadcasts transactions on-chain
```

## ✨ Features

- **True Autonomy** — Agents run independently on a cycle with configurable interval
- **Composable Pipeline** — Each agent is a standalone module; swap or extend any of them
- **Risk-Aware Decisions** — Protocol utilization, break-even analysis, gas cost modelling
- **Real-Time Dashboard** — Live APY chart, market table with sparklines, agent log
- **Cycle History** — Full audit trail of every decision and transaction
- **Auto Mode** — Continuous agent operation with 8-second cycle intervals
- **Somnia L1 Native** — Chain 50312, 400ms block time, dream-rpc.somnia.network

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/eidolon.git
cd eidolon

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js — click **Deploy**
4. Set environment variables in Vercel dashboard (see `.env.example`)

Or use the CLI:
```bash
npx vercel
```

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_SOMNIA_RPC` | `https://dream-rpc.somnia.network` | Somnia L1 RPC endpoint |
| `NEXT_PUBLIC_CHAIN_ID` | `50312` | Somnia Devnet chain ID |
| `NEXT_PUBLIC_CYCLE_INTERVAL` | `8000` | Auto-mode cycle interval (ms) |
| `NEXT_PUBLIC_APY_THRESHOLD` | `2.5` | Min APY delta to trigger rebalance |

## 🔑 Going Live with Real Transactions

The current build uses a simulated `SomniaClient`. To broadcast real transactions:

1. Set `AGENT_PRIVATE_KEY` in your environment (never commit this)
2. Replace `sendTransaction` in `src/lib/somniaClient.ts` with real ethers.js calls:

```ts
import { ethers } from 'ethers'

const provider = new ethers.JsonRpcProvider(SOMNIA_CONFIG.rpc)
const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY!, provider)
const tx = await wallet.sendTransaction({ to, data, value })
const receipt = await tx.wait()
```

3. Get Somnia devnet SMT from the faucet at [somnia.network](https://somnia.network)

## 📁 Project Structure

```
eidolon/
├── src/
│   ├── agents/
│   │   ├── DataAgent.ts        # On-chain data fetcher
│   │   ├── DecisionAgent.ts    # Yield reasoning engine
│   │   ├── ExecutorAgent.ts    # Transaction broadcaster
│   │   └── Orchestrator.ts     # Pipeline coordinator
│   ├── components/
│   │   ├── agents/
│   │   │   └── AgentPipeline.tsx
│   │   ├── dashboard/
│   │   │   ├── Header.tsx
│   │   │   ├── StatsBar.tsx
│   │   │   ├── MarketTable.tsx
│   │   │   ├── DecisionCard.tsx
│   │   │   ├── ApyChart.tsx
│   │   │   ├── AgentLog.tsx
│   │   │   ├── HistoryTable.tsx
│   │   │   └── ChainStatus.tsx
│   │   └── ui/
│   │       └── HexEmblem.tsx
│   ├── hooks/
│   │   └── useAgent.ts         # Core state manager
│   ├── lib/
│   │   ├── types.ts            # TypeScript interfaces
│   │   └── somniaClient.ts     # Somnia L1 client
│   ├── pages/
│   │   ├── api/agent/
│   │   │   ├── cycle.ts        # POST /api/agent/cycle
│   │   │   ├── markets.ts      # GET  /api/agent/markets
│   │   │   └── status.ts       # GET  /api/agent/status
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   └── index.tsx           # Main dashboard
│   └── styles/
│       └── globals.css
├── public/
│   └── favicon.svg
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── package.json
```

## 🏆 Built For

Somnia Agentic L1 Hackathon — *Build the most novel and high-impact agent-driven application on Somnia*

---

*"Just like the engineers of 1937 who built a bridge across unpredictable waters — you are being asked to build agent applications that reshape what's possible on-chain."*
