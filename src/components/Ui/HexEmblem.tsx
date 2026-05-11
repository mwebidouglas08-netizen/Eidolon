interface Props {
  running: boolean
  size?: number
}

export default function HexEmblem({ running, size = 64 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={running ? 'animate-pulse-slow' : ''}
    >
      <defs>
        <radialGradient id="hexGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C17B2E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C17B2E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow */}
      <ellipse cx="50" cy="50" rx="45" ry="45" fill="url(#hexGlow)" opacity={running ? 1 : 0.4} />

      {/* Outer hex */}
      <polygon
        points="50,8 88,29 88,71 50,92 12,71 12,29"
        fill="#0D1B2A"
        stroke="#C17B2E"
        strokeWidth="1.5"
        opacity="0.9"
      />
      {/* Mid hex */}
      <polygon
        points="50,18 80,35 80,65 50,82 20,65 20,35"
        fill="#162232"
        stroke="#E8943A"
        strokeWidth="0.8"
        opacity="0.5"
      />
      {/* Inner hex */}
      <polygon
        points="50,28 72,40 72,62 50,74 28,62 28,40"
        fill="#0D1B2A"
        stroke="#C17B2E"
        strokeWidth="0.6"
        opacity="0.6"
      />

      {/* Agent dots */}
      <circle cx="50" cy="12" r="3" fill="#378ADD">
        {running && <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />}
      </circle>
      <circle cx="81" cy="68" r="3" fill="#C17B2E">
        {running && <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" begin="0.4s" repeatCount="indefinite" />}
      </circle>
      <circle cx="19" cy="68" r="3" fill="#1D9E75">
        {running && <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" begin="0.8s" repeatCount="indefinite" />}
      </circle>

      {/* Center ⬡ */}
      <text
        x="50" y="57"
        textAnchor="middle"
        fontSize="24"
        fill="#C17B2E"
        opacity="0.9"
        fontFamily="serif"
      >
        ⬡
      </text>
    </svg>
  )
}
