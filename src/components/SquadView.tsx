import { useState } from 'react'
import type { Player } from '../types/models'
import { computeOverall } from '../data/playerGen'
import { PlayerDetailPanel } from './PlayerDetailPanel'
import { SortableTh } from './SortableTh'

type SortKey = 'name' | 'pos' | 'age' | 'overall' | 'value' | 'wage'

function sortValue(player: Player, key: SortKey): string | number {
  switch (key) {
    case 'name':
      return `${player.firstName} ${player.lastName}`
    case 'pos':
      return player.position
    case 'age':
      return player.age
    case 'overall':
      return computeOverall(player.attributes)
    case 'value':
      return player.value
    case 'wage':
      return player.wage
  }
}

export function SquadView({
  squad,
  onRelease,
}: {
  squad: Player[]
  onRelease: (playerId: string) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('overall')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...squad].sort((a, b) => {
    const av = sortValue(a, sortKey)
    const bv = sortValue(b, sortKey)
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : av - (bv as number)
    return sortDir === 'asc' ? cmp : -cmp
  })
  const selected = sorted.find((p) => p.id === selectedId)

  return (
    <div className="mt-6">
      <h2 className="border-l-4 border-[var(--color-pitch)] pl-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-chalk)]">
        Squad · {squad.length} players
      </h2>
      <table className="mt-2 w-full text-left text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
            <SortableTh label="Player" sortKey="name" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
            <SortableTh label="Pos" sortKey="pos" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
            <SortableTh label="Age" sortKey="age" activeKey={sortKey} dir={sortDir} onSort={handleSort} align="right" />
            <SortableTh label="OVR" sortKey="overall" activeKey={sortKey} dir={sortDir} onSort={handleSort} align="right" />
            <SortableTh label="Value" sortKey="value" activeKey={sortKey} dir={sortDir} onSort={handleSort} align="right" />
            <SortableTh label="Wage" sortKey="wage" activeKey={sortKey} dir={sortDir} onSort={handleSort} align="right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-line)]">
          {sorted.map((player) => (
            <tr
              key={player.id}
              onClick={() => setSelectedId(player.id === selectedId ? null : player.id)}
              className={`transition-standard cursor-pointer hover:bg-white/[0.03] ${
                selectedId === player.id ? 'bg-white/[0.04]' : ''
              }`}
            >
              <td className="py-1.5 text-[var(--color-chalk)]">
                {player.firstName} {player.lastName}
              </td>
              <td className="py-1.5 text-[var(--color-chalk-dim)]">{player.position}</td>
              <td className="font-mono-num py-1.5 text-right text-[var(--color-chalk-dim)]">
                {player.age}
              </td>
              <td className="font-mono-num py-1.5 text-right text-[var(--color-chalk)]">
                {computeOverall(player.attributes)}
              </td>
              <td className="font-mono-num led-amber py-1.5 text-right">
                ${player.value.toLocaleString()}
              </td>
              <td className="font-mono-num py-1.5 text-right text-[var(--color-chalk-dim)]">
                ${player.wage}/wk
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="mt-4">
          <PlayerDetailPanel
            player={selected}
            action={{
              label: 'Release',
              tone: 'sell',
              onClick: () => onRelease(selected.id),
            }}
          />
        </div>
      )}
    </div>
  )
}
