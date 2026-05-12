import { AgentStats, AgentStatus } from '../../lib/types'
import { SOMNIA_CONFIG } from '../../lib/somniaClient'

function fmtUptime(s: number) {
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map(x => x.toString().padStart(2, '0')).join(':')
}

interface Props { stats: AgentStats; status: AgentStatus; autoMode: boolean }

export default function Header({ stats, status, autoMode }: Props) {
  return (
    <header style={{ background: 'rgba(13,27,42,0.85)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(74,158,191,0.1)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg select-none"
            style={{ background: '#0D1B2A', border: '0.5px solid rgba(193,123,46,0.3)' }}>
            ⬡
          </div>
          <div>
            <span className="font-display text-sm font-semibold text-offwhite tracking-wide">EIDOLON</span>
            <span className="hidden sm:inline text-muted text-xs ml-2 font-mono">Autonomous Yield Intelligence</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 font-mono text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" style={{ animation: 'pulse 2s infinite' }}></span>
            Chain {SOMNIA_CONFIG.chainId}
          </span>
          <span className="text-navy-500">|</span>
          <span>{SOMNIA_CONFIG.rpc.replace('https://', '')}</span>
          <span className="text-navy-500">|</span>
          <span>{SOMNIA_CONFIG.blockTime}ms blocks</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          {autoMode && <span className="badge badge-gold">AUTO</span>}
          <span className={`badge ${status === 'running' ? 'badge-gold' : status === 'error' ? 'badge-red' : 'badge-green'}`}>
            {status === 'running' ? '⟳ RUNNING' : status === 'error' ? '✗ ERROR' : '● LIVE'}
          </span>
          <span className="badge badge-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtUptime(stats.uptime)}</span>
        </div>
      </div>
    </header>
  )
}
