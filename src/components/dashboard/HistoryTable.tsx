import { HistoryEntry } from '../../lib/types'
import { SOMNIA_CONFIG } from '../../lib/somniaClient'

interface Props {
  history: HistoryEntry[]
  onClear: () => void
}

export default function HistoryTable({ history, onClear }: Props) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-muted tracking-widest font-mono">CYCLE HISTORY</span>
        {history.length > 0 && (
          <button onClick={onClear} className="text-[10px] text-muted hover:text-offwhite font-mono transition-colors">
            clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-muted text-xs font-mono">No cycles completed yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-mono">
            <thead>
              <tr className="border-b border-navy-500/50">
                {['TIME', 'ACTION', 'FROM', 'TO', 'APY Δ', 'CONF', 'GAS', 'TX'].map(h => (
                  <th key={h} className="text-left text-[9px] text-muted tracking-widest pb-2 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map(entry => {
                const d = new Date(entry.timestamp)
                const t = [d.getHours(), d.getMinutes(), d.getSeconds()].map(x => x.toString().padStart(2, '0')).join(':')
                return (
                  <tr key={entry.cycleId} className="border-b border-navy-600/30 hover:bg-navy-700/20 transition-colors">
                    <td className="py-2 pr-3 text-muted tabular-nums">{t}</td>
                    <td className="py-2 pr-3">
                      <span className={`badge ${entry.action === 'REBALANCE' ? 'badge-gold' : 'badge-muted'}`}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-muted">{entry.from}</td>
                    <td className="py-2 pr-3 text-offwhite/80">{entry.to}</td>
                    <td className={`py-2 pr-3 ${entry.apyDelta > 0 ? 'text-mint' : 'text-muted'}`}>
                      +{entry.apyDelta.toFixed(2)}%
                    </td>
                    <td className="py-2 pr-3 text-muted">{entry.confidence}%</td>
                    <td className="py-2 pr-3 text-muted">{entry.gasUsed?.toLocaleString() || '—'}</td>
                    <td className="py-2">
                      {entry.txHash ? (
                        <a
                          href={`${SOMNIA_CONFIG.blockExplorer}/tx/${entry.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-steel hover:text-offwhite transition-colors"
                          title={entry.txHash}
                        >
                          {entry.txHash.slice(0, 8)}...
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
