export function StatBar({
  label,
  value,
  max = 100,
  color = 'var(--color-pitch)',
}: {
  label: string
  value: number
  max?: number
  color?: string
}) {
  return (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
        <span>{label}</span>
        <span className="font-mono-num">{value}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-black/30">
        <div
          className="h-full rounded-full"
          style={{ width: `${(value / max) * 100}%`, background: color }}
        />
      </div>
    </div>
  )
}
