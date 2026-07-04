export function SortableTh<K extends string>({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  align = 'left',
}: {
  label: string
  sortKey: K
  activeKey: K
  dir: 'asc' | 'desc'
  onSort: (key: K) => void
  align?: 'left' | 'right'
}) {
  const active = sortKey === activeKey
  return (
    <th className={`py-1.5 font-medium ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <button
        onClick={() => onSort(sortKey)}
        className={`transition-standard cursor-pointer uppercase tracking-wide hover:text-[var(--color-chalk)] ${
          active ? 'text-[var(--color-chalk)]' : 'text-[var(--color-chalk-dim)]'
        }`}
      >
        {label}
        {active ? (dir === 'asc' ? ' ▲' : ' ▼') : ''}
      </button>
    </th>
  )
}
