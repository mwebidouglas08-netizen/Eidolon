import { AgentStats } from '../../lib/types'

interface Props { stats: AgentStats }

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: 'CYCLES RUN',     value: stats.cycleCount,                           color: 'text-steel' },
    { label: 'REBALANCES',     value: stats.rebalanceCount,                        color: 'text-gold-light' },
    { label: 'TX BROADCAST',   value: stats.totalTx,                              color: 'text-mint' },
    { label: 'YIELD GAINED',   value: `+${stats.totalYieldGained.toFixed(3)} SMT`, color: 'text-mint' },
    { label: 'GAS USED',       value: stats.totalGasUsed.toLocaleString(),         color: 'text-muted' },
    { label: 'BEST APY SEEN',  value: `${stats.bestApy.toFixed(2)}%`,             color: 'text-gold-bright' },
    { label: 'CURRENT POOL',   value: stats.currentProtocol,                      color: 'text-offwhite' },
    { label: 'HOLD CYCLES',    value: stats.holdCount,                             color: 'text-muted' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {items.map(({ label, value, color }) => (
        <div key={label} className="card px-3 py-2.5">
          <div className="text-[9px] text-muted tracking-widest mb-1 font-mono">{label}</div>
          <div className={`text-sm font-mono font-medium truncate ${color}`}>{value}</div>
        </div>
      ))}
    </div>
  )
}
