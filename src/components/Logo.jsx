export default function Logo({ className = 'logo', title }) {
  return (
    <svg className={className} viewBox="0 0 512 512" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id="rl-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f06d20" /><stop offset="1" stopColor="#c94706" /></linearGradient>
        <linearGradient id="rl-unit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f6f7" /><stop offset="1" stopColor="#d5dade" /></linearGradient>
      </defs>
      <rect width="512" height="512" rx="114" fill="url(#rl-bg)" />
      <rect x="92" y="84" width="328" height="344" rx="30" fill="#1b1f23" />
      <rect x="116" y="110" width="22" height="292" rx="7" fill="#626a72" />
      <rect x="374" y="110" width="22" height="292" rx="7" fill="#626a72" />
      {[
        { y: 124, slots: [[152, 96]], led: '#33d17a' },
        { y: 218, slots: [[152, 64], [226, 40]], led: '#33d17a' },
        { y: 312, slots: [[152, 120]], led: '#f5b12e' },
      ].map((u) => (
        <g key={u.y}>
          <rect x="128" y={u.y} width="256" height="76" rx="12" fill="url(#rl-unit)" />
          {u.slots.map(([x, w]) => <rect key={x} x={x} y={u.y + 28} width={w} height="20" rx="6" fill="#2a2f34" />)}
          <circle cx="350" cy={u.y + 38} r="13" fill={u.led} />
        </g>
      ))}
    </svg>
  );
}
