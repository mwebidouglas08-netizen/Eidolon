import { AgentStep, AgentStatus } from '../../lib/types'

const AGENTS = [
  { name: 'DataAgent'     as const, color: '#378ADD', desc: 'Fetches block, gas, balances & APYs from Somnia L1' },
  { name: 'DecisionAgent' as const, color: '#C17B2E', desc: 'Reasons about yield delta, risk & gas cost' },
  { name: 'ExecutorAgent' as const, color: '#1D9E75', desc: 'Signs and broadcasts transactions on-chain' },
]

interface Props {
  steps: Record<string, AgentStep>
  status: AgentStatus
  onRun: () => void
  onToggleAuto: () => void
  autoMode: boolean
  running: boolean
}

export default function AgentPipeline({ steps, status, onRun, onToggleAuto, autoMode, running }: Props) {
  return (
    <div className="card p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted tracking-widest font-mono">AGENT PIPELINE</span>
        <div className="flex gap-2">
          <button
            onClick={onToggleAuto}
            className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all ${
              autoMode
                ? 'bg-mint/10 border-mint/30 text-mint'
                : 'bg-navy-600 border-steel/20 text-muted hover:text-offwhite hover:border-steel/40'
            }`}
          >
            {autoMode ? '⏸ Stop Auto' : '⟳ Auto'}
          </button>
          <button
            onClick={onRun}
            disabled={running}
            className={`text-[11px] font-mono px-4 py-1.5 rounded-lg border transition-all font-medium ${
              running
                ? 'bg-gold/10 border-gold/20 text-gold/60 cursor-not-allowed'
                : 'bg-gold/15 border-gold/40 text-gold-light hover:bg-gold/25 hover:border-gold/60'
            }`}
            style={{ animation: running ? undefined : undefined }}
          >
            {running ? '⟳ Running...' : '▶ Run Cycle'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-0">
        {AGENTS.map((agent, idx) => {
          const step = steps[agent.name]
          const isRunning = step?.status === 'running'
          const isDone = step?.status === 'done'
          const isError = step?.status === 'error'

          return (
            <div key={agent.name} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center" style={{ width: 20 }}>
                <div
                  className="w-2.5 h-2.5 rounded-full mt-3 flex-shrink-0 transition-all duration-300"
                  style={{
                    background: isDone ? agent.color : isRunning ? agent.color : isError ? '#E24B4A' : '#243344',
                    boxShadow: isRunning ? `0 0 8px ${agent.color}` : isDone ? `0 0 4px ${agent.color}40` : 'none',
                    animation: isRunning ? 'pulse 1s infinite' : undefined,
                  }}
                />
                {idx < AGENTS.length - 1 && (
                  <div className="w-px flex-1 mt-1" style={{ background: isDone ? `${agent.color}30` : '#1B2A3B' }} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-3 ${idx < AGENTS.length - 1 ? '' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-mono font-medium tracking-widest" style={{ color: isDone || isRunning ? agent.color : '#7B9AB0' }}>
                    {agent.name}
                  </span>
                  {isRunning && <span className="badge badge-gold text-[9px]" style={{ animation: 'pulse 1s infinite' }}>RUNNING</span>}
                  {isDone && <span className="badge badge-green text-[9px]">DONE</span>}
                  {isError && <span className="badge badge-red text-[9px]">ERROR</span>}
                  {!step && <span className="badge badge-muted text-[9px]">IDLE</span>}
                </div>
                <p className="text-[11px] text-muted leading-relaxed font-mono">
                  {step?.message || agent.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
