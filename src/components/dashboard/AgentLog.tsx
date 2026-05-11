import { useEffect, useRef } from 'react'
import { LogEntry } from '../../lib/types'

interface Props {
  logs: LogEntry[]
  onClear: () => void
}

const typeStyle: Record<LogEntry['type'], string> = {
  info:    'text-muted',
  success: 'text-mint',
  warn:    'text-gold-light',
  error:   'text-red-400',
}

export default function AgentLog({ logs, onClear }: Props) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted tracking-widest font-mono">AGENT LOG</span>
        <button
          onClick={onClear}
          className="text-[10px] text-muted hover:text-offwhite font-mono transition-colors"
        >
          clear
        </button>
      </div>

      <div className="font-mono text-[11px] max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin">
        {logs.length === 0 && (
          <div className="text-muted text-center py-3">Waiting for activity...</div>
        )}
        {logs.map(log => (
          <div key={log.id} className="flex gap-2 border-b border-navy-600/30 py-0.5 leading-relaxed">
            <span className="text-navy-500 flex-shrink-0 tabular-nums">{log.timestamp}</span>
            {log.agent && (
              <span className="text-steel/60 flex-shrink-0">[{log.agent.replace('Agent', '')}]</span>
            )}
            <span className={typeStyle[log.type]}>{log.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Cursor */}
      <div className="flex items-center gap-1 font-mono text-[11px]">
        <span className="text-navy-500">{'>'}</span>
        <span className="w-1.5 h-3 bg-gold animate-blink" />
      </div>
    </div>
  )
}
