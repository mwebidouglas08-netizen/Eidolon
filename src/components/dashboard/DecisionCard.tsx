import { AgentCycleResult } from '../../lib/types'

interface Props { result: AgentCycleResult | null }

export default function DecisionCard({ result }: Props) {
  if (!result) return null
  const { decision, execution } = result

  const isRebalance = decision.action === 'REBALANCE'

  return (
    <div className="card p-4 animate-fade-slide">
      <div className="text-[10px] text-muted tracking-widest font-mono mb-3">DECISION OUTPUT</div>

      {/* Action + Confidence */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-navy-800 rounded-lg p-3">
          <div className="text-[9px] text-muted tracking-widest mb-1">ACTION</div>
          <div className={`text-lg font-mono font-semibold ${isRebalance ? 'text-gold-light' : 'text-muted'}`}>
            {decision.action}
          </div>
        </div>
        <div className="bg-navy-800 rounded-lg p-3">
          <div className="text-[9px] text-muted tracking-widest mb-1">CONFIDENCE</div>
          <div className="text-lg font-mono font-semibold text-offwhite">{decision.confidence}%</div>
          <div className="progress-bar mt-1.5">
            <div className="progress-fill" style={{ width: `${decision.confidence}%`, background: '#C17B2E' }} />
          </div>
        </div>
        <div className="bg-navy-800 rounded-lg p-3">
          <div className="text-[9px] text-muted tracking-widest mb-1">APY DELTA</div>
          <div className={`text-lg font-mono font-semibold ${decision.apyDelta > 0 ? 'text-mint' : 'text-red-400'}`}>
            +{decision.apyDelta}%
          </div>
        </div>
        <div className="bg-navy-800 rounded-lg p-3">
          <div className="text-[9px] text-muted tracking-widest mb-1">BREAK-EVEN</div>
          <div className="text-lg font-mono font-semibold text-offwhite">{decision.breakEvenDays}d</div>
        </div>
      </div>

      {/* Route */}
      <div className="bg-navy-800 rounded-lg p-3 mb-3 flex items-center gap-3">
        <div className="text-[10px] text-muted font-mono flex-1 text-right">{decision.from.name}</div>
        <div className="flex items-center gap-1 text-gold">
          <div className="w-8 h-px bg-gold/40" />
          <span className="text-xs">→</span>
          <div className="w-8 h-px bg-gold/40" />
        </div>
        <div className="text-[10px] text-mint font-mono font-medium flex-1">{decision.to.name}</div>
      </div>

      {/* Reasoning */}
      <div className="bg-navy-800/60 rounded-lg p-3 text-[11px] text-muted font-mono leading-relaxed border-l-2 border-gold/30">
        💡 {decision.reasoning}
      </div>

      {/* Execution Result */}
      {execution.executed && (
        <div className="mt-3 border border-mint/20 rounded-lg p-3 bg-mint/5">
          <div className="text-[9px] text-mint tracking-widest font-mono mb-2">✓ EXECUTED ON-CHAIN</div>
          <div className="space-y-1.5">
            <div>
              <div className="text-[9px] text-muted mb-0.5">WITHDRAW TX</div>
              <div className="tx-hash">{execution.withdrawTx}</div>
            </div>
            <div>
              <div className="text-[9px] text-muted mb-0.5">DEPOSIT TX</div>
              <div className="tx-hash">{execution.depositTx}</div>
            </div>
            <div className="flex gap-4 text-[10px] text-muted mt-2 font-mono">
              <span>Block #{execution.blockConfirmed?.toLocaleString()}</span>
              <span>Gas: {execution.gasUsed?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
