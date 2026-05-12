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

const ApyChart = dynamic(() => import('../components/dashboard/ApyChart'), { ssr: false })

function HexLogo({ running, size = 64 }: { running: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{ animation: running ? 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' : undefined }}>
      <defs>
        <radialGradient id="hg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C17B2E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C17B2E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="50" rx="45" ry="45" fill="url(#hg)" opacity={running ? 1 : 0.4} />
      <polygon points="50,8 88,29 88,71 50,92 12,71 12,29" fill="#0D1B2A" stroke="#C17B2E" strokeWidth="1.5" opacity="0.9" />
      <polygon points="50,18 80,35 80,65 50,82 20,65 20,35" fill="#162232" stroke="#E8943A" strokeWidth="0.8" opacity="0.5" />
      <polygon points="50,28 72,40 72,62 50,74 28,62 28,40" fill="#0D1B2A" stroke="#C17B2E" strokeWidth="0.6" opacity="0.6" />
      <circle cx="50" cy="12" r="3" fill="#378ADD" />
      <circle cx="81" cy="68" r="3" fill="#C17B2E" />
      <circle cx="19" cy="68" r="3" fill="#1D9E75" />
      <text x="50" y="57" textAnchor="middle" fontSize="24" fill="#C17B2E" opacity="0.9" fontFamily="serif">⬡</text>
    </svg>
  )
}

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

          <div className="card p-5" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <HexLogo running={running} size={72} />
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
          </div>

          <StatsBar stats={stats} />

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <MarketTable result={lastResult} apyHistory={apyHistory} />
              <ApyChart apyHistory={apyHistory} result={lastResult} />
              <AgentLog logs={logs} onClear={clearLogs} />
              <HistoryTable history={history} onClear={clearHistory} />
            </div>
          </div>

          <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 10, color: 'rgba(123,154,176,0.35)', borderTop: '0.5px solid rgba(27,42,59,0.4)', paddingTop: 16 }}>
            EIDOLON · Autonomous Yield Intelligence · Somnia Agentic L1 · Chain 50312 · Built for the Somnia Hackathon
          </div>
        </main>
      </div>
    </>
  )
}
