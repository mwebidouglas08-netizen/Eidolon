import { AgentStats } from '../../lib/types'

interface Props { stats: AgentStats }

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: 'CYCLES',    value: stats.cycleCount,                            color: '#4A9EBF' },
    { label: 'REBALANCES', value: stats.rebalanceCount,                       color: '#E8943A' },
    { label: 'TX SENT',   value: stats.totalTx,                               color: '#1D9E75' },
    { label: 'YIELD',     value: `+${stats.totalYieldGained.toFixed(3)} SMT`, color: '#1D9E75' },
    { label: 'GAS USED',  value: stats.totalGasUsed.toLocaleString(),         color: '#7B9AB0' },
    { label: 'BEST APY',  value: `${stats.bestApy.toFixed(2)}%`,             color: '#F0A500' },
    { label: 'POOL',      value: stats.currentProtocol,                       color: '#E8EDF2' },
    { label: 'HOLDS',     value: stats.holdCount,                             color: '#7B9AB0' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {items.map(({ label, value, color }) => (
        <div key={label} className="card px-3 py-2.5">
          <div className="text-[9px] text-muted tracking-widest mb-1 font-mono">{label}</div>
          <div className="text-sm font-mono font-medium truncate" style={{ color }}>{value}</div>
        </div>
      ))}
    </div>
  )
}
