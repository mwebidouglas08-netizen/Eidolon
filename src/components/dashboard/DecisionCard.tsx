import { AgentCycleResult } from '../../lib/types'

interface Props { result: AgentCycleResult | null }

export default function DecisionCard({ result }: Props) {
  if (!result) return null
  const { decision, execution } = result
  const isRebalance = decision.action === 'REBALANCE'
  return (
    <div className="card p-4">
      <div className="text-[10px] text-muted tracking-widest font-mono mb-3">DECISION OUTPUT</div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: 'ACTION',     value: decision.action,                       color: isRebalance ? '#E8943A' : '#7B9AB0', big: true },
          { label: 'CONFIDENCE', value: `${decision.confidence}%`,             color: '#E8EDF2', big: true },
          { label: 'APY DELTA',  value: `+${decision.apyDelta}%`,              color: decision.apyDelta > 0 ? '#1D9E75' : '#E24B4A', big: true },
          { label: 'BREAK-EVEN', value: `${decision.breakEvenDays}d`,         color: '#E8EDF2', big: true },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#0F2034', borderRadius: 8, padding: '10px 12px' }}>
            <div className="text-[9px] text-muted tracking-widest mb-1 font-mono">{label}</div>
            <div className="text-base font-mono font-semibold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#0F2034', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }} className="flex items-center gap-3">
        <span className="text-[10px] text-muted font-mono flex-1 text-right">{decision.from.name}</span>
        <span style={{ color: '#C17B2E' }}>→</span>
        <span className="text-[10px] font-mono font-medium flex-1" style={{ color: '#1D9E75' }}>{decision.to.name}</span>
      </div>
      <div className="text-[11px] text-muted font-mono leading-relaxed p-3 rounded-lg" style={{ background: 'rgba(15,32,52,0.6)', borderLeft: '2px solid rgba(193,123,46,0.4)' }}>
        💡 {decision.reasoning}
      </div>
      {execution.executed && (
        <div className="mt-3 p-3 rounded-lg" style={{ border: '0.5px solid rgba(29,158,117,0.3)', background: 'rgba(29,158,117,0.05)' }}>
          <div className="text-[9px] tracking-widest font-mono mb-2" style={{ color: '#1D9E75' }}>✓ EXECUTED ON-CHAIN</div>
          <div className="grid grid-cols-1 gap-1.5">
            <div>
              <div className="text-[9px] text-muted mb-0.5">WITHDRAW TX</div>
              <div className="tx-hash">{execution.withdrawTx}</div>
            </div>
            <div>
              <div className="text-[9px] text-muted mb-0.5">DEPOSIT TX</div>
              <div className="tx-hash">{execution.depositTx}</div>
            </div>
            <div className="flex gap-4 text-[10px] text-muted mt-1 font-mono">
              <span>Block #{execution.blockConfirmed?.toLocaleString()}</span>
              <span>Gas: {execution.gasUsed?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
