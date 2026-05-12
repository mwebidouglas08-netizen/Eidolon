import { SomniaClient } from '../lib/somniaClient'
import { AgentDecision, ExecutionResult } from '../lib/types'

export class ExecutorAgent {
  constructor(private client: SomniaClient) {}

  async run(decision: AgentDecision): Promise<ExecutionResult> {
    if (decision.action === 'HOLD') {
      return { executed: false, reason: decision.reasoning }
    }
    try {
      const withdraw = await this.client.sendTransaction({
        to: decision.from.address,
        data: '0x2e1a7d4d',
        value: '1000000000000000000',
      })
      const deposit = await this.client.sendTransaction({
        to: decision.to.address,
        data: '0xb6b55f25',
        value: '1000000000000000000',
      })
      return {
        executed: true,
        withdrawTx: withdraw.hash,
        depositTx: deposit.hash,
        gasUsed: withdraw.gasUsed + deposit.gasUsed,
        blockConfirmed: deposit.blockNumber,
      }
    } catch (err) {
      return {
        executed: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  }
}
