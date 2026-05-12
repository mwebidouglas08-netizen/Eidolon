import { SomniaClient, SOMNIA_CONFIG } from '../lib/somniaClient'
import { MarketData } from '../lib/types'

export class DataAgent {
  constructor(private client: SomniaClient) {}

  async run(): Promise<MarketData> {
    const [blockNumber, gasPrice, balance, markets] = await Promise.all([
      this.client.getBlockNumber(),
      this.client.getGasPrice(),
      this.client.getBalance('0xAGENT'),
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
