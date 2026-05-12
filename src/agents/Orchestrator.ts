import { DataAgent } from './DataAgent'
import { DecisionAgent } from './DecisionAgent'
import { ExecutorAgent } from './ExecutorAgent'
import { SomniaClient } from '../lib/somniaClient'
import { AgentCycleResult, AgentStep } from '../lib/types'

export type StepCallback = (step: AgentStep) => void

export class Orchestrator {
  private data: DataAgent
  private decision: DecisionAgent
  private executor: ExecutorAgent

  constructor(client: SomniaClient) {
    this.data = new DataAgent(client)
    this.decision = new DecisionAgent()
    this.executor = new ExecutorAgent(client)
  }

  async runCycle(onStep?: StepCallback): Promise<AgentCycleResult> {
    const cycleId = `cycle_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const start = Date.now()

    const step = (
      agent: AgentStep['agent'],
      status: AgentStep['status'],
      message: string,
      data?: unknown
    ) => onStep?.({ agent, status, message, data, timestamp: Date.now() })

    step('DataAgent', 'running', 'Fetching on-chain state from Somnia L1...')
    const marketData = await this.data.run()
    step('DataAgent', 'done',
      `Block #${marketData.blockNumber.toLocaleString()} · Gas ${marketData.gasPrice} gwei · Balance ${marketData.balance} SMT`,
      marketData
    )

    await new Promise(r => setTimeout(r, 400))

    step('DecisionAgent', 'running', 'Analyzing market opportunities...')
    await new Promise(r => setTimeout(r, 500))
    const decision = this.decision.run(marketData)
    step('DecisionAgent', 'done', decision.reasoning, decision)

    step(
      'ExecutorAgent', 'running',
      decision.action === 'REBALANCE'
        ? `Broadcasting: ${decision.from.name} → ${decision.to.name}`
        : 'Holding position — no transaction needed'
    )
    const execution = await this.executor.run(decision)
    step(
      'ExecutorAgent', 'done',
      execution.executed
        ? `Confirmed · ${execution.gasUsed?.toLocaleString()} gas · Block #${execution.blockConfirmed}`
        : (execution.reason || 'Position maintained'),
      execution
    )

    return { marketData, decision, execution, cycleId, duration: Date.now() - start }
  }
}
