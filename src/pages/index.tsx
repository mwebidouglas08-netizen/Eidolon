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
        <meta property="og:title" content="EIDOLON — Autonomous Yield Intelligence" />
        <meta property="og:description" content="Autonomous DeFi agent on Somnia Agentic L1" />
      </Head>

      <div className="min-h-screen grid-bg">
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '33%', left: '50%', transform: 'translateX(-50%)', width: 384, height: 384, borderRadius: '50%', background: 'radial-gradient(circle, rgba(193,123,46,0.06) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', top: '66%', left: '25%', width: 256, height: 256, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,158,191,0.05) 0%, transparent 70%)' }} />
        </div>

        <Header stats={stats} status={status} autoMode={autoMode} />

        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>

          {/* Hero */}
          <div className="card p-5" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <HexEmblem running={running} size={72} />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: '#E8EDF2', letterSpacing: '0.02em', textShadow: '0 0 20px rgba(193,123,46,0.4)' }}>
                EIDOLON
              </h1>
              <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#7B9AB0', marginTop: 4 }}>
                Autonomous Yield Intelligence · Somnia Agentic L1 · Chain 50312
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(123,154,176,0.5)', marginTop: 4 }}>
                DataAgent · DecisionAgent · ExecutorAgent
              </p>
            </div>
            <div style={{ display: 'none', flexDirection: 'column', gap: 4, textAlign: 'right', fontFamily: 'monospace', fontSize: 11 }} className="sm-flex">
              <span style={{ color: '#7B9AB0' }}>dream-rpc.somnia.network</span>
              <span style={{ color: '#4A9EBF' }}>400ms block time</span>
              <span style={{ color: 'rgba(193,123,46,0.6)' }}>Agentic L1 Infrastructure</span>
            </div>
          </div>

          {/* Stats */}
          <StatsBar stats={stats} />

          {/* 3-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>

            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <MarketTable result={lastResult} apyHistory={apyHistory} />
              <ApyChart apyHistory={apyHistory} result={lastResult} />
              <AgentLog logs={logs} onClear={clearLogs} />
              <HistoryTable history={history} onClear={clearHistory} />
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 10, color: 'rgba(123,154,176,0.35)', borderTop: '0.5px solid rgba(27,42,59,0.4)', paddingTop: 16 }}>
            EIDOLON · Autonomous Yield Intelligence · Somnia Agentic L1 · Chain 50312 · Built for the Somnia Hackathon
          </div>
        </main>
      </div>
    </>
  )
}
