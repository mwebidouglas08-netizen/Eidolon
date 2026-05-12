import { HistoryEntry } from '../../lib/types'
import { SOMNIA_CONFIG } from '../../lib/somniaClient'

interface Props { history: HistoryEntry[]; onClear: () => void }

export default function HistoryTable({ history, onClear }: Props) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-muted tracking-widest font-mono">CYCLE HISTORY</span>
        {history.length > 0 && (
          <button onClick={onClear} className="text-[10px] text-muted hover:text-offwhite font-mono transition-colors">clear</button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center py-8 text-muted text-xs font-mono">No cycles completed yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full font-mono" style={{ fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid rgba(36,51,68,0.8)' }}>
                {['TIME','ACTION','FROM','TO','APY Δ','CONF','GAS','TX'].map(h => (
                  <th key={h} className="text-left pb-2 pr-3 font-medium" style={{ fontSize: 9, color: '#7B9AB0', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map(entry => {
                const d = new Date(entry.timestamp)
                const t = [d.getHours(), d.getMinutes(), d.getSeconds()].map(x => x.toString().padStart(2,'0')).join(':')
                return (
                  <tr key={entry.cycleId} style={{ borderBottom: '0.5px solid rgba(27,42,59,0.5)' }}>
                    <td className="py-2 pr-3" style={{ color: '#7B9AB0', fontVariantNumeric: 'tabular-nums' }}>{t}</td>
                    <td className="py-2 pr-3">
                      <span className={`badge ${entry.action === 'REBALANCE' ? 'badge-gold' : 'badge-muted'}`}>{entry.action}</span>
                    </td>
                    <td className="py-2 pr-3" style={{ color: '#7B9AB0' }}>{entry.from}</td>
                    <td className="py-2 pr-3" style={{ color: 'rgba(232,237,242,0.8)' }}>{entry.to}</td>
                    <td className="py-2 pr-3" style={{ color: entry.apyDelta > 0 ? '#1D9E75' : '#7B9AB0' }}>+{entry.apyDelta.toFixed(2)}%</td>
                    <td className="py-2 pr-3" style={{ color: '#7B9AB0' }}>{entry.confidence}%</td>
                    <td className="py-2 pr-3" style={{ color: '#7B9AB0' }}>{entry.gasUsed?.toLocaleString() || '—'}</td>
                    <td className="py-2">
                      {entry.txHash ? (
                        <a href={`${SOMNIA_CONFIG.blockExplorer}/tx/${entry.txHash}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#4A9EBF' }}>
                          {entry.txHash.slice(0, 8)}...
                        </a>
                      ) : <span style={{ color: '#7B9AB0' }}>—</span>}
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
