export interface Protocol {
  id: string
  name: string
  baseApy: number
  tvl: number
  address: string
}

export interface Market extends Protocol {
  apy: number
  utilization: number
  tvlChange: number
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface MarketData {
  blockNumber: number
  gasPrice: number
  balance: number
  markets: Market[]
  timestamp: number
  chainId: number
}

export interface AgentDecision {
  action: 'REBALANCE' | 'HOLD'
  from: Market
  to: Market
  apyDelta: number
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH'
  confidence: number
  breakEvenDays: number
  gasCost: number
  reasoning: string
  markets: Market[]
}

export interface ExecutionResult {
  executed: boolean
  withdrawTx?: string
  depositTx?: string
  gasUsed?: number
  blockConfirmed?: number
  reason?: string
  error?: string
}

export interface AgentCycleResult {
  marketData: MarketData
  decision: AgentDecision
  execution: ExecutionResult
  cycleId: string
  duration: number
}

export interface AgentStep {
  agent: 'DataAgent' | 'DecisionAgent' | 'ExecutorAgent'
  status: 'idle' | 'running' | 'done' | 'error'
  message: string
  data?: unknown
  timestamp: number
}

export interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warn' | 'error'
  agent?: string
}

export interface AgentStats {
  cycleCount: number
  totalTx: number
  totalYieldGained: number
  totalGasUsed: number
  uptime: number
  lastCycleAt: number | null
  rebalanceCount: number
  holdCount: number
  bestApy: number
  currentProtocol: string
}

export interface HistoryEntry {
  cycleId: string
  timestamp: number
  action: 'REBALANCE' | 'HOLD'
  from: string
  to: string
  apyDelta: number
  confidence: number
  txHash?: string
  gasUsed?: number
}

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error'
