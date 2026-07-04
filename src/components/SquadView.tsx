import { useState } from 'react'
import type { Player } from '../types/models'
import { computeOverall } from '../data/playerGen'
import { PlayerDetailPanel } from './PlayerDetailPanel'

export function SquadView({
  squad,
  onRelease,
}: {
  squad: Player[]
  onRelease: (playerId: string) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const sorted = [...squad].sort((a, b) => computeOverall(b.attributes) - computeOverall(a.attributes))
  const selected = sorted.find((p) => p.id === selectedId)

  return (
    <div className="mt-6">
      <h2 className="border-l-4 border-[var(--color-pitch)] pl-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-chalk)]">
        Squad · {squad.length} players
      </h2>
      <table className="mt-2 w-full text-left text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
            <th className="py-1.5 font-medium">Player</th>
            <th className="py-1.5 font-medium">Pos</th>
            <th className="py-1.5 text-right font-medium">Age</th>
            <th className="py-1.5 text-right font-medium">OVR</th>
            <th className="font-mono-num py-1.5 text-right font-medium">Value</th>
            <th className="font-mono-num py-1.5 text-right font-medium">Wage</th>
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
