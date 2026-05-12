import { MarketData, AgentDecision } from '../lib/types'

const APY_THRESHOLD = parseFloat(process.env.NEXT_PUBLIC_APY_THRESHOLD || '2.5')

export class DecisionAgent {
  run(data: MarketData): AgentDecision {
    const { markets, gasPrice, balance } = data
    const sorted = [...markets].sort((a, b) => b.apy - a.apy)
    const best = sorted[0]
    const current = sorted[Math.floor(Math.random() * sorted.length)]
    const apyDelta = +(best.apy - current.apy).toFixed(2)
    const riskScore = best.riskScore
    const gasCost = +(gasPrice * 0.000042 * 2).toFixed(6)
    const dailyGain = balance * (apyDelta / 100 / 365)
    const breakEvenDays = dailyGain > 0 ? +(gasCost / dailyGain).toFixed(1) : 999
    const shouldRebalance =
      apyDelta > APY_THRESHOLD &&
      riskScore !== 'HIGH' &&
      balance > 0.05 &&
      breakEvenDays < 30
    const confidence = Math.min(99, Math.floor(
      50 +
      Math.min(apyDelta * 6, 25) +
      (riskScore === 'LOW' ? 15 : riskScore === 'MEDIUM' ? 5 : -10) +
      (breakEvenDays < 7 ? 10 : breakEvenDays < 14 ? 5 : 0)
    ))
    const reasoning = shouldRebalance
      ? `APY delta ${apyDelta.toFixed(2)}% exceeds threshold. ${riskScore} risk. Break-even ${breakEvenDays} days. Moving ${balance.toFixed(2)} SMT to ${best.name}.`
      : apyDelta <= APY_THRESHOLD
      ? `APY delta ${apyDelta.toFixed(2)}% below ${APY_THRESHOLD}% threshold. Gas not justified.`
      : riskScore === 'HIGH'
      ? `${best.name} utilization HIGH. Avoiding despite ${apyDelta.toFixed(2)}% delta.`
      : `Break-even ${breakEvenDays} days exceeds 30-day limit. Holding.`

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
