import { SOMNIA_CONFIG } from '../../lib/somniaClient'
import { AgentStats } from '../../lib/types'

interface Props { stats: AgentStats }

export default function ChainStatus({ stats }: Props) {
  return (
    <div className="card p-4">
      <div className="text-[10px] text-muted tracking-widest font-mono mb-3">CHAIN STATUS</div>
      <div className="space-y-2 font-mono text-[11px]">
        {[
          { label: 'Network',      value: SOMNIA_CONFIG.chainName,                    color: 'text-mint' },
          { label: 'Chain ID',     value: String(SOMNIA_CONFIG.chainId),              color: 'text-offwhite' },
          { label: 'Block Time',   value: `${SOMNIA_CONFIG.blockTime}ms`,             color: 'text-steel' },
          { label: 'Symbol',       value: SOMNIA_CONFIG.symbol,                       color: 'text-gold-light' },
          { label: 'Last Cycle',   value: stats.lastCycleAt
              ? `${Math.floor((Date.now() - stats.lastCycleAt) / 1000)}s ago`
              : 'Never',                                                               color: 'text-muted' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between border-b border-navy-600/40 pb-1.5">
            <span className="text-muted">{label}</span>
            <span className={color}>{value}</span>
          </div>
        ))}

        <a
          href={SOMNIA_CONFIG.blockExplorer}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-steel hover:text-offwhite transition-colors pt-1"
        >
          <span>Block Explorer</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  )
}
