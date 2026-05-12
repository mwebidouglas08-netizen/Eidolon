import { useEffect, useRef } from 'react'
import { LogEntry } from '../../lib/types'

interface Props { logs: LogEntry[]; onClear: () => void }

const typeColor: Record<LogEntry['type'], string> = {
  info: '#7B9AB0', success: '#1D9E75', warn: '#E8943A', error: '#E24B4A',
}

export default function AgentLog({ logs, onClear }: Props) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [logs])
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted tracking-widest font-mono">AGENT LOG</span>
        <button onClick={onClear} className="text-[10px] text-muted hover:text-offwhite font-mono transition-colors">clear</button>
      </div>
      <div className="font-mono text-[11px] overflow-y-auto" style={{ maxHeight: 192 }}>
        {logs.length === 0 && <div className="text-muted text-center py-3">Waiting for activity...</div>}
        {logs.map(log => (
          <div key={log.id} className="flex gap-2 py-0.5" style={{ borderBottom: '0.5px solid rgba(27,42,59,0.5)' }}>
            <span style={{ color: '#243344', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{log.timestamp}</span>
            {log.agent && <span style={{ color: 'rgba(74,158,191,0.5)', flexShrink: 0 }}>[{log.agent.replace('Agent', '')}]</span>}
            <span style={{ color: typeColor[log.type] }}>{log.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center gap-1 font-mono text-[11px]">
        <span className="text-muted">{'>'}</span>
        <span className="animate-blink" style={{ width: 6, height: 12, background: '#C17B2E', display: 'inline-block' }} />
      </div>
    </div>
  )
}
