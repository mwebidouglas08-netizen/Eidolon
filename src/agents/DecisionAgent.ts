// ─── DecisionAgent ────────────────────────────────────────────────────────────
// Responsibility: Reason about market data, output a typed action plan

import { MarketData, AgentDecision, Market } from '../lib/types'

const APY_THRESHOLD = parseFloat(process.env.NEXT_PUBLIC_APY_THRESHOLD || '2.5')

export class DecisionAgent {
  readonly name = 'DecisionAgent'
  readonly role = 'Reasons about yield opportunities, risk, and gas costs — outputs a typed action plan'
  readonly color = '#C17B2E'

  run(data: MarketData): AgentDecision {
    const { markets, gasPrice, balance } = data

    // Sort by APY descending
    const sorted = [...markets].sort((a, b) => b.apy - a.apy)
    const best = sorted[0]

    // Pick a random current position (simulating existing allocation)
    const currentIdx = Math.floor(Math.random() * sorted.length)
    const current = sorted[currentIdx]

    const apyDelta = +(best.apy - current.apy).toFixed(2)
    const riskScore = best.riskScore

    // Gas cost calculation (estimate 2 txs: withdraw + deposit)
    const gasCost = +(gasPrice * 0.000042 * 2).toFixed(6)

    // Break-even: days until yield gain offsets gas cost
    const dailyYieldGain = balance * (apyDelta / 100 / 365)
    const breakEvenDays = dailyYieldGain > 0 ? +(gasCost / dailyYieldGain).toFixed(1) : 999

    // Decision logic
    const shouldRebalance =
      apyDelta > APY_THRESHOLD &&
      riskScore !== 'HIGH' &&
      balance > 0.05 &&
      breakEvenDays < 30

    // Confidence scoring (0-99)
    const confidence = Math.min(99, Math.floor(
      50 +
      Math.min(apyDelta * 6, 25) +
      (riskScore === 'LOW' ? 15 : riskScore === 'MEDIUM' ? 5 : -10) +
      (breakEvenDays < 7 ? 10 : breakEvenDays < 14 ? 5 : 0)
    ))

    const reasoning = shouldRebalance
      ? `APY differential ${apyDelta.toFixed(2)}% exceeds ${APY_THRESHOLD}% threshold. ` +
        `${riskScore} risk profile. Break-even in ${breakEvenDays} days. ` +
        `Moving ${balance.toFixed(2)} SMT from ${current.name} → ${best.name}.`
      : apyDelta <= APY_THRESHOLD
      ? `APY delta ${apyDelta.toFixed(2)}% below ${APY_THRESHOLD}% threshold. Gas cost not justified. Holding position.`
      : riskScore === 'HIGH'
      ? `${best.name} utilization ${(best.utilization * 100).toFixed(0)}% — HIGH risk. Avoiding despite ${apyDelta.toFixed(2)}% delta.`
      : `Break-even ${breakEvenDays} days exceeds 30-day limit. Holding current allocation.`

    return {
      action: shouldRebalance ? 'REBALANCE' : 'HOLD',
      from: current,
      to: best,
      apyDelta,
      riskScore,
      confidence,
      breakEvenDays,
      gasCost,
      reasoning,
      markets: sorted,
    }
  }
}
