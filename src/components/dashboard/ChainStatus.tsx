import { SOMNIA_CONFIG } from '../../lib/somniaClient'
import { AgentStats } from '../../lib/types'

interface Props { stats: AgentStats }

export default function ChainStatus({ stats }: Props) {
  return (
    <div className="card p-4">
      <div className="text-[10px] text-muted tracking-widest font-mono mb-3">CHAIN STATUS</div>
      <div className="space-y-2 font-mono text-[11px]">
        {[
          { label: 'Network',    value: SOMNIA_CONFIG.chainName, color: '#1D9E75' },
          { label: 'Chain ID',   value: String(SOMNIA_CONFIG.chainId), color: '#E8EDF2' },
          { label: 'Block Time', value: `${SOMNIA_CONFIG.blockTime}ms`, color: '#4A9EBF' },
          { label: 'Symbol',     value: SOMNIA_CONFIG.symbol, color: '#E8943A' },
          { label: 'Last Cycle', value: stats.lastCycleAt ? `${Math.floor((Date.now() - stats.lastCycleAt) / 1000)}s ago` : 'Never', color: '#7B9AB0' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between pb-1.5" style={{ borderBottom: '0.5px solid rgba(27,42,59,0.6)' }}>
            <span className="text-muted">{label}</span>
            <span style={{ color }}>{value}</span>
          </div>
        ))}
        <a href={SOMNIA_CONFIG.blockExplorer} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 pt-1 transition-colors"
          style={{ color: '#4A9EBF' }}>
          <span>Block Explorer</span><span>↗</span>
        </a>
      </div>
    </div>
  )
}
