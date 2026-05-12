import { AgentCycleResult } from '../../lib/types'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

interface Props {
  apyHistory: Record<string, number[]>
  result: AgentCycleResult | null
}

const COLORS: Record<string, string> = {
  somnia_swap: '#378ADD',
  dream_lend:  '#7B9AB0',
  ether_vault: '#4A9EBF',
  flux_fi:     '#E8943A',
  nexus_dao:   '#1D9E75',
}

const NAMES: Record<string, string> = {
  somnia_swap: 'SomniaSwap',
  dream_lend:  'DreamLend',
  ether_vault: 'EtherVault',
  flux_fi:     'FluxFi',
  nexus_dao:   'NexusDAO',
}

export default function ApyChart({ apyHistory, result }: Props) {
  const ids = Object.keys(apyHistory)

  if (ids.length === 0) {
    return (
      <div className="card p-4">
        <div className="text-[10px] text-muted tracking-widest font-mono mb-3">APY TREND</div>
        <div className="flex items-center justify-center font-mono text-xs text-muted" style={{ height: 120 }}>
          Run a cycle to populate chart
        </div>
      </div>
    )
  }

  const maxLen = Math.max(...ids.map(id => apyHistory[id]?.length || 0))
  const data = Array.from({ length: maxLen }, (_, i) => {
    const entry: Record<string, number | string> = { tick: i + 1 }
    ids.forEach(id => {
      if (apyHistory[id]?.[i] !== undefined) entry[id] = apyHistory[id][i]
    })
    return entry
  })

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-muted tracking-widest font-mono">APY TREND</span>
        {result && (
          <span className="text-[10px] text-muted font-mono">
            Best: <span style={{ color: '#1D9E75' }}>{result.decision.to.name} {result.decision.to.apy.toFixed(2)}%</span>
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-2">
        {ids.map(id => (
          <div key={id} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded" style={{ background: COLORS[id] || '#7B9AB0' }} />
            <span className="text-[10px] font-mono" style={{ color: '#7B9AB0' }}>{NAMES[id] || id}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={130}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="tick"
            tick={{ fill: '#7B9AB0', fontSize: 9, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#7B9AB0', fontSize: 9, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: '#0D1B2A',
              border: '0.5px solid #1B2A3B',
              borderRadius: 6,
              fontSize: 11,
              fontFamily: 'monospace',
            }}
            labelStyle={{ color: '#7B9AB0' }}
            formatter={(val: number) => [`${val.toFixed(2)}%`]}
          />
          {ids.map(id => (
            <Line
              key={id}
              type="monotone"
              dataKey={id}
              stroke={COLORS[id] || '#7B9AB0'}
              strokeWidth={1.5}
              dot={false}
              name={NAMES[id] || id}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
