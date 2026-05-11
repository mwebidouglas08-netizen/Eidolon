// pages/api/agent/markets.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { SomniaClient } from '../../../lib/somniaClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const client = new SomniaClient()
    const [blockNumber, gasPrice, balance, markets] = await Promise.all([
      client.getBlockNumber(),
      client.getGasPrice(),
      client.getBalance('0xAGENT'),
      client.getMarketData(),
    ])

    return res.status(200).json({ blockNumber, gasPrice, balance, markets, timestamp: Date.now() })
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
