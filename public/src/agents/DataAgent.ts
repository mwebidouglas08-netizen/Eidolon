// ─── DataAgent ────────────────────────────────────────────────────────────────
// Responsibility: Fetch all on-chain state from Somnia L1

import { SomniaClient, SOMNIA_CONFIG } from '../lib/somniaClient'
import { MarketData } from '../lib/types'

export class DataAgent {
  readonly name = 'DataAgent'
  readonly role = 'Fetches block number, gas price, wallet balance, and live APYs from Somnia L1'
  readonly color = '#378ADD'

  constructor(private client: SomniaClient) {}

  async run(): Promise<MarketData> {
    const [blockNumber, gasPrice, balance, markets] = await Promise.all([
      this.client.getBlockNumber(),
      this.client.getGasPrice(),
      this.client.getBalance('0xAGENT_ADDRESS'),
      this.client.getMarketData(),
    ])

    return {
      blockNumber,
      gasPrice,
      balance,
      markets,
      timestamp: Date.now(),
      chainId: SOMNIA_CONFIG.chainId,
    }
  }
}
