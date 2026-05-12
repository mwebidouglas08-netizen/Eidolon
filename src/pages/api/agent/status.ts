import type { NextApiRequest, NextApiResponse } from 'next'
import { SOMNIA_CONFIG } from '../../../lib/somniaClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  return res.status(200).json({
    status: 'connected',
    chain: SOMNIA_CONFIG.chainName,
    chainId: SOMNIA_CONFIG.chainId,
    rpc: SOMNIA_CONFIG.rpc,
    blockExplorer: SOMNIA_CONFIG.blockExplorer,
    blockTime: SOMNIA_CONFIG.blockTime,
    timestamp: Date.now(),
  })
}
