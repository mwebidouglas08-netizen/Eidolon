import { AgentStats, AgentStatus } from '../../lib/types'
import { SOMNIA_CONFIG } from '../../lib/somniaClient'

function fmtUptime(s: number) {
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map(x => x.toString().padStart(2, '0')).join(':')
}

interface Props {
  stats: AgentStats
  status: AgentStatus
  autoMode: boolean
}

export default function Header({ stats, status, autoMode }: Props) {
  return (
    <header className="glass border-b border-steel/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy-900 border border-gold/30 flex items-center justify-center text-lg select-none"
            style={{ animation: status === 'running' ? 'pulse-gold 1.5s infinite' : undefined }}>
            ⬡
          </div>
          <div>
            <span className="font-display text-sm font-semibold text-offwhite tracking-wide">EIDOLON</span>
            <span className="hidden sm:inline text-muted text-xs ml-2 font-mono">Autonomous Yield Intelligence</span>
          </div>
        </div>

        {/* Center: chain info */}
        <div className="hidden md:flex items-center gap-4 font-mono text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse"></span>
            Chain {SOMNIA_CONFIG.chainId}
          </span>
          <span className="text-navy-500">|</span>
          <span>{SOMNIA_CONFIG.rpc.replace('https://', '')}</span>
          <span className="text-navy-500">|</span>
          <span>{SOMNIA_CONFIG.blockTime}ms blocks</span>
        </div>

        {/* Right: status badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {autoMode && (
            <span className="badge badge-gold" style={{ animation: 'pulse 2s infinite' }}>AUTO</span>
          )}
          <span className={`badge ${status === 'running' ? 'badge-gold' : status === 'error' ? 'badge-red' : 'badge-green'}`}>
            {status === 'running' ? '⟳ RUNNING' : status === 'error' ? '✗ ERROR' : '● LIVE'}
          </span>
          <span className="badge badge-muted tabular-nums">{fmtUptime(stats.uptime)}</span>
        </div>
      </div>
    </header>
  )
}
