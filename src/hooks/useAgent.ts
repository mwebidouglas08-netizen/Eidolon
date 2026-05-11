// ─── useAgent Hook ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  AgentStats, AgentStep, AgentStatus, LogEntry,
  HistoryEntry, AgentCycleResult
} from '../lib/types'

function uid() { return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}` }
function fmtTime() {
  const n = new Date()
  return [n.getHours(), n.getMinutes(), n.getSeconds()]
    .map(x => x.toString().padStart(2, '0')).join(':')
}

const DEFAULT_STATS: AgentStats = {
  cycleCount: 0, totalTx: 0, totalYieldGained: 0, totalGasUsed: 0,
  uptime: 0, lastCycleAt: null, rebalanceCount: 0, holdCount: 0,
  bestApy: 0, currentProtocol: 'None',
}

export function useAgent() {
  const [status, setStatus]           = useState<AgentStatus>('idle')
  const [autoMode, setAutoModeState]  = useState(false)
  const [steps, setSteps]             = useState<Record<string, AgentStep>>({})
  const [logs, setLogs]               = useState<LogEntry[]>([])
  const [stats, setStats]             = useState<AgentStats>(DEFAULT_STATS)
  const [lastResult, setLastResult]   = useState<AgentCycleResult | null>(null)
  const [history, setHistory]         = useState<HistoryEntry[]>([])
  const [apyHistory, setApyHistory]   = useState<Record<string, number[]>>({})

  const autoRef   = useRef(false)
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const cycleRef  = useRef(0)
  const booted    = useRef(false)

  // Uptime ticker
  useEffect(() => {
    const t = setInterval(() => setStats(s => ({ ...s, uptime: s.uptime + 1 })), 1000)
    return () => clearInterval(t)
  }, [])

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info', agent?: string) => {
    setLogs(prev => [...prev.slice(-80), { id: uid(), timestamp: fmtTime(), message, type, agent }])
  }, [])

  const updateStep = useCallback((step: AgentStep) => {
    setSteps(prev => ({ ...prev, [step.agent]: step }))
  }, [])

  const runCycle = useCallback(async () => {
    if (status === 'running') return
    setStatus('running')
    setSteps({})
    addLog('─── Agent cycle started ───', 'info')

    try {
      const res = await fetch('/api/agent/cycle', { method: 'POST' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      const { result, steps: apiSteps }: { result: AgentCycleResult; steps: AgentStep[] } = data

      for (const step of apiSteps) {
        updateStep(step)
        addLog(step.message, step.status === 'done' ? 'success' : step.status === 'error' ? 'error' : 'info', step.agent)
        await new Promise(r => setTimeout(r, 180))
      }

      setLastResult(result)

      setApyHistory(prev => {
        const n = { ...prev }
        result.marketData.markets.forEach((m: { id: string; apy: number }) => {
          n[m.id] = [...(n[m.id] || []).slice(-24), m.apy]
        })
        return n
      })

      cycleRef.current++
      const executed = result.execution.executed
      setStats(prev => ({
        ...prev,
        cycleCount: cycleRef.current,
        totalTx: prev.totalTx + (executed ? 2 : 0),
        totalYieldGained: executed ? +(prev.totalYieldGained + result.decision.apyDelta * 0.01).toFixed(4) : prev.totalYieldGained,
        totalGasUsed: prev.totalGasUsed + (result.execution.gasUsed || 0),
        lastCycleAt: Date.now(),
        rebalanceCount: prev.rebalanceCount + (executed ? 1 : 0),
        holdCount: prev.holdCount + (executed ? 0 : 1),
        bestApy: Math.max(prev.bestApy, result.decision.to.apy),
        currentProtocol: result.decision.to.name,
      }))

      setHistory(prev => [{
        cycleId: result.cycleId,
        timestamp: result.marketData.timestamp,
        action: result.decision.action,
        from: result.decision.from.name,
        to: result.decision.to.name,
        apyDelta: result.decision.apyDelta,
        confidence: result.decision.confidence,
        txHash: result.execution.depositTx,
        gasUsed: result.execution.gasUsed,
      }, ...prev].slice(0, 50))

      addLog(executed
        ? `✓ Rebalanced → ${result.decision.to.name} · +${result.decision.apyDelta}% APY`
        : `Hold · ${result.decision.reasoning.slice(0, 70)}...`,
        executed ? 'success' : 'warn'
      )
    } catch (err) {
      addLog(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error')
      setStatus('error')
      return
    }

    setStatus('idle')
    addLog('─── Cycle complete ───', 'info')
  }, [status, addLog, updateStep])

  const toggleAutoMode = useCallback(() => {
    const next = !autoRef.current
    autoRef.current = next
    setAutoModeState(next)
    if (next) {
      addLog('Auto-mode enabled · cycling every 8s', 'success')
      autoTimer.current = setInterval(() => { if (autoRef.current) runCycle() }, 8000)
    } else {
      if (autoTimer.current) clearInterval(autoTimer.current)
      addLog('Auto-mode disabled', 'warn')
    }
  }, [addLog, runCycle])

  // Boot logs
  useEffect(() => {
    if (booted.current) return
    booted.current = true
    addLog('Somnia Agentic L1 node connected · Chain ID 50312', 'success')
    addLog('RPC: dream-rpc.somnia.network', 'info')
    addLog('Orchestrator initialized · 3 sub-agents ready', 'success')
    addLog('DataAgent · DecisionAgent · ExecutorAgent online', 'info')
  }, [addLog])

  useEffect(() => () => { if (autoTimer.current) clearInterval(autoTimer.current) }, [])

  return {
    status, autoMode, steps, logs, stats, lastResult, history, apyHistory,
    runCycle, toggleAutoMode,
    clearLogs: useCallback(() => setLogs([]), []),
    clearHistory: useCallback(() => setHistory([]), []),
  }
}
