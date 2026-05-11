// ─── ExecutorAgent ────────────────────────────────────────────────────────────
// Responsibility: Sign and broadcast transactions on Somnia L1

import { SomniaClient } from '../lib/somniaClient'
import { AgentDecision, ExecutionResult } from '../lib/types'

export class ExecutorAgent {
  readonly name = 'ExecutorAgent'
  readonly role = 'Signs and broadcasts withdraw + deposit transactions on Somnia L1'
  readonly color = '#1D9E75'

  constructor(private client: SomniaClient) {}

  async run(decision: AgentDecision): Promise<ExecutionResult> {
    if (decision.action === 'HOLD') {
      return { executed: false, reason: decision.reasoning }
    }

    try {
      // Step 1: Withdraw from current protocol
      const withdrawTx = await this.client.sendTransaction({
        to: decision.from.address,
        data: '0x2e1a7d4d', // withdraw(uint256)
        value: '1000000000000000000',
      })

      // Step 2: Deposit into best protocol
      const depositTx = await this.client.sendTransaction({
        to: decision.to.address,
        data: '0xb6b55f25', // deposit(uint256)
        value: '1000000000000000000',
      })

      return {
        executed: true,
        withdrawTx: withdrawTx.hash,
        depositTx: depositTx.hash,
        gasUsed: withdrawTx.gasUsed + depositTx.gasUsed,
        blockConfirmed: depositTx.blockNumber,
      }
    } catch (err) {
      return {
        executed: false,
        error: err instanceof Error ? err.message : 'Unknown execution error',
      }
    }
  }
}
