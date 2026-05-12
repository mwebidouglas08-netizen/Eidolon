import { AgentCycleResult } from '../../lib/types'

interface Props {
  result: AgentCycleResult | null
  apyHistory: Record<string, number[]>
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (!values || values.length < 2) return <div style={{ width: 64, height: 20, background: '#1B2A3B', borderRadius: 3 }} />
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1
  const w = 64, h = 20
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(' ')
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export default function MarketTable({ result, apyHistory }: Props) {
  if (!result) {
    return (
      <div className="card p-4">
        <div className="text-[10px] text-muted tracking-widest font-mono mb-3">LIVE MARKET FEED</div>
        <div className="text-center py-8 text-muted text-xs font-mono">Run an agent cycle to fetch market data</div>
      </div>
    )
  }
  const { decision, marketData } = result
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-muted tracking-widest font-mono">LIVE MARKET FEED</span>
        <span className="text-[10px] text-muted font-mono">Block #{marketData.blockNumber.toLocaleString()} · {marketData.gasPrice} gwei</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(36,51,68,0.8)' }}>
              {['PROTOCOL','APY','TVL','UTILIZATION','TREND','RISK','STATUS'].map(h => (
                <th key={h} className="text-left pb-2 pr-3 font-medium" style={{ fontSize: 9, color: '#7B9AB0', letterSpacing: '0.08em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {decision.markets.map((m, i) => {
              const isTarget = m.id === decision.to.id
              const isFrom   = m.id === decision.from.id && result.execution.executed
              const hist     = apyHistory[m.id] || []
              const uPct     = (m.utilization * 100).toFixed(0)
              const uColor   = m.utilization > 0.85 ? '#E24B4A' : m.utilization > 0.65 ? '#EF9F27' : '#1D9E75'
              return (
                <tr key={m.id} style={{ borderBottom: '0.5px solid rgba(27,42,59,0.6)', background: isTarget ? 'rgba(29,158,117,0.05)' : undefined }}>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      {isTarget && <span style={{ color: '#F0A500' }}>★</span>}
                      <span style={{ color: isTarget ? '#E8EDF2' : 'rgba(232,237,242,0.8)', fontWeight: isTarget ? 500 : 400 }}>{m.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3" style={{ color: isTarget ? '#1D9E75' : 'rgba(232,237,242,0.8)', fontWeight: 500 }}>{m.apy.toFixed(2)}%</td>
                  <td className="py-2.5 pr-3" style={{ color: '#7B9AB0' }}>${m.tvl.toFixed(1)}M</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="progress-bar" style={{ width: 64 }}>
                        <div className="progress-fill" style={{ width: `${uPct}%`, background: uColor }} />
                      </div>
                      <span style={{ color: '#7B9AB0' }}>{uPct}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <Sparkline values={hist} color={isTarget ? '#1D9E75' : '#378ADD'} />
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className={`badge ${m.riskScore === 'LOW' ? 'badge-green' : m.riskScore === 'MEDIUM' ? 'badge-gold' : 'badge-red'}`}>
                      {m.riskScore}
                    </span>
                  </td>
                  <td className="py-2.5">
                    {isTarget ? <span className="badge badge-green">TARGET</span>
                    : isFrom  ? <span className="badge badge-gold">EXITED</span>
                    : <span className="badge badge-muted">#{i + 1}</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
