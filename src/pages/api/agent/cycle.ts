import type { NextApiRequest, NextApiResponse } from 'next'
import { Orchestrator } from '../../../agents/Orchestrator'
import { SomniaClient } from '../../../lib/somniaClient'
import { AgentStep } from '../../../lib/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const client = new SomniaClient()
    const orchestrator = new Orchestrator(client)
    const steps: AgentStep[] = []
    const result = await orchestrator.runCycle(step => steps.push(step))
    return res.status(200).json({ success: true, result, steps })
  } catch (err) {
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
