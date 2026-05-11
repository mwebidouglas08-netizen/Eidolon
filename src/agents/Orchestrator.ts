// ─── Orchestrator ─────────────────────────────────────────────────────────────
// Coordinates the full agent pipeline: Data → Decision → Execution

import { DataAgent } from './DataAgent'
import { DecisionAgent } from './DecisionAgent'
import { ExecutorAgent } from './ExecutorAgent'
import { SomniaClient } from '../lib/somniaClient'
import { AgentCycleResult, AgentStep } from '../lib/types'

export type StepCallback = (step: AgentStep) => void

export class Orchestrator {
  private dataAgent: DataAgent
  private decisionAgent: DecisionAgent
  private executorAgent: ExecutorAgent

  constructor(client: SomniaClient) {
    this.dataAgent = new DataAgent(client)
    this.decisionAgent = new DecisionAgent()
    this.executorAgent = new ExecutorAgent(client)
  }

  async runCycle(onStep?: StepCallback): Promise<AgentCycleResult> {
    const cycleId = `cycle_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const startTime = Date.now()

    const step = (agent: AgentStep['agent'], status: AgentStep['status'], message: string, data?: unknown) => {
      onStep?.({ agent, status, message, data, timestamp: Date.now() })
    }

    // ── Phase 1: Data Collection ──
    step('DataAgent', 'running', 'Fetching on-chain state from Somnia L1...')
    const marketData = await this.dataAgent.run()
    step('DataAgent', 'done',
      `Block #${marketData.blockNumber.toLocaleString()} · Gas ${marketData.gasPrice} gwei · Balance ${marketData.balance} SMT`,
      marketData
    )

    // Small delay for realism
    await new Promise(r => setTimeout(r, 400))

    // ── Phase 2: Decision Making ──
    step('DecisionAgent', 'running', 'Analyzing market opportunities and risk...')
    await new Promise(r => setTimeout(r, 600))
    const decision = this.decisionAgent.run(marketData)
    step('DecisionAgent', 'done', decision.reasoning, decision)

    // ── Phase 3: Execution ──
    step('ExecutorAgent', 'running',
      decision.action === 'REBALANCE'
        ? `Broadcasting rebalance: ${decision.from.name} → ${decision.to.name}`
        : 'Hold position — no transaction required'
    )
    const execution = await this.executorAgent.run(decision)
    step('ExecutorAgent', 'done',
      execution.executed
        ? `Rebalance confirmed · ${execution.gasUsed?.toLocaleString()} gas · Block #${execution.blockConfirmed}`
        : execution.reason || 'Position maintained',
      execution
    )

    return {
      marketData,
      decision,
      execution,
      cycleId,
      duration: Date.now() - startTime,
    }
  }
}
