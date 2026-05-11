import { Market, AgentCycleResult } from '../../lib/types'

interface Props {
  result: AgentCycleResult | null
  apyHistory: Record<string, number[]>
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (!values || values.length < 2) return <div className="w-16 h-5 bg-navy-600 rounded" />
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1
  const w = 64, h = 20
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(' ')
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function RiskBadge({ risk }: { risk: Market['riskScore'] }) {
  const map = { LOW: 'badge-green', MEDIUM: 'badge-gold', HIGH: 'badge-red' }
  return <span className={`badge ${map[risk]}`}>{risk}</span>
}

export default function MarketTable({ result, apyHistory }: Props) {
  if (!result) {
    return (
      <div className="card p-4">
        <div className="text-[10px] text-muted tracking-widest font-mono mb-3">LIVE MARKET FEED</div>
        <div className="text-center py-8 text-muted text-xs font-mono">
          Run an agent cycle to fetch market data
        </div>
      </div>
    )
  }

  const { decision, marketData } = result
  const markets = decision.markets

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-muted tracking-widest font-mono">LIVE MARKET FEED</span>
        <span className="text-[10px] text-muted font-mono">
          Block #{marketData.blockNumber.toLocaleString()} · {marketData.gasPrice} gwei
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-navy-500/50">
              {['PROTOCOL', 'APY', 'TVL', 'UTILIZATION', 'TREND', 'RISK', 'STATUS'].map(h => (
                <th key={h} className="text-left text-[9px] text-muted tracking-widest pb-2 pr-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {markets.map((m, i) => {
              const isTarget = m.id === decision.to.id
              const isFrom = m.id === decision.from.id && result.execution.executed
              const hist = apyHistory[m.id] || []
              const sparkColor = isTarget ? '#1D9E75' : '#378ADD'

              return (
                <tr
                  key={m.id}
                  className={`border-b border-navy-600/40 transition-colors ${
                    isTarget ? 'bg-mint/5' : 'hover:bg-navy-700/30'
                  }`}
                >
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      {isTarget && <span className="text-gold-bright">★</span>}
                      <span className={isTarget ? 'text-offwhite font-medium' : 'text-offwhite/80'}>{m.name}</span>
                    </div>
                  </td>
                  <td className={`py-2.5 pr-3 font-medium ${isTarget ? 'text-mint' : 'text-offwhite/80'}`}>
                    {m.apy.toFixed(2)}%
                  </td>
                  <td className="py-2.5 pr-3 text-muted">${m.tvl.toFixed(1)}M</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="progress-bar w-16">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(m.utilization * 100).toFixed(0)}%`,
                            background: m.utilization > 0.85 ? '#E24B4A' : m.utilization > 0.65 ? '#EF9F27' : '#1D9E75',
                          }}
                        />
                      </div>
                      <span className="text-muted">{(m.utilization * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <Sparkline values={hist} color={sparkColor} />
                  </td>
                  <td className="py-2.5 pr-3">
                    <RiskBadge risk={m.riskScore} />
                  </td>
                  <td className="py-2.5">
                    {isTarget ? (
                      <span className="badge badge-green">TARGET</span>
                    ) : isFrom ? (
                      <span className="badge badge-gold">EXITED</span>
                    ) : (
                      <span className="badge badge-muted">#{i + 1}</span>
                    )}
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
