import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useAgent } from '../hooks/useAgent'
import Header from '../components/dashboard/Header'
import StatsBar from '../components/dashboard/StatsBar'
import AgentPipeline from '../components/agents/AgentPipeline'
import MarketTable from '../components/dashboard/MarketTable'
import DecisionCard from '../components/dashboard/DecisionCard'
import AgentLog from '../components/dashboard/AgentLog'
import HistoryTable from '../components/dashboard/HistoryTable'
import ChainStatus from '../components/dashboard/ChainStatus'
import HexEmblem from '../components/ui/HexEmblem'

// Recharts must be client-side only
const ApyChart = dynamic(() => import('../components/dashboard/ApyChart'), { ssr: false })

export default function Home() {
  const {
    status, autoMode, steps, logs, stats,
    lastResult, history, apyHistory,
    runCycle, toggleAutoMode, clearLogs, clearHistory,
  } = useAgent()

  const running = status === 'running'

  return (
    <>
      <Head>
        <title>EIDOLON — Autonomous Yield Intelligence · Somnia L1</title>
        <meta name="description" content="Autonomous DeFi yield optimization agent on Somnia Agentic L1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:title" content="EIDOLON — Autonomous Yield Intelligence" />
        <meta property="og:description" content="Autonomous DeFi agent on Somnia Agentic L1" />
      </Head>

      {/* Grid background */}
      <div className="min-h-screen grid-bg">

        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(193,123,46,0.06) 0%, transparent 70%)' }} />
          <div className="absolute top-2/3 left-1/4 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(74,158,191,0.05) 0%, transparent 70%)' }} />
        </div>

        <Header stats={stats} status={status} autoMode={autoMode} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4 relative">

          {/* Hero banner */}
          <div className="flex items-center gap-5 card p-5">
            <HexEmblem running={running} size={72} />
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-offwhite tracking-wide glow-text">
                EIDOLON
              </h1>
              <p className="text-muted text-sm font-mono mt-0.5">
                Autonomous Yield Intelligence · Somnia Agentic L1 · Chain 50312
              </p>
              <p className="text-[11px] text-muted/60 font-mono mt-1">
                3 sub-agents · DataAgent · DecisionAgent · ExecutorAgent
              </p>
            </div>
            <div className="hidden sm:flex flex-col gap-1 text-right font-mono text-[11px]">
              <span className="text-muted">dream-rpc.somnia.network</span>
              <span className="text-steel">400ms block time</span>
              <span className="text-gold/60">Agentic L1 Infrastructure</span>
            </div>
          </div>

          {/* Stats bar */}
          <StatsBar stats={stats} />

          {/* Main 3-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left column */}
            <div className="flex flex-col gap-4">
              <AgentPipeline
                steps={steps}
                status={status}
                onRun={runCycle}
                onToggleAuto={toggleAutoMode}
                autoMode={autoMode}
                running={running}
              />
              <DecisionCard result={lastResult} />
              <ChainStatus stats={stats} />
            </div>

            {/* Center + Right: 2 columns */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <MarketTable result={lastResult} apyHistory={apyHistory} />
              <ApyChart apyHistory={apyHistory} result={lastResult} />
              <AgentLog logs={logs} onClear={clearLogs} />
              <HistoryTable history={history} onClear={clearHistory} />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center font-mono text-[10px] text-muted/40 py-4 border-t border-navy-600/30">
            EIDOLON · Autonomous Yield Intelligence · Somnia Agentic L1 · Chain 50312 · Built for the Somnia Hackathon
          </div>
        </main>
      </div>
    </>
  )
}
