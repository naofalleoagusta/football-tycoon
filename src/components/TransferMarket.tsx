import { useMemo, useState } from 'react'
import type { Club, Player, PlayerPosition } from '../types/models'
import { computeOverall } from '../data/playerGen'
import { PlayerDetailPanel } from './PlayerDetailPanel'

const POSITIONS: (PlayerPosition | 'All')[] = ['All', 'GK', 'DEF', 'MID', 'FWD']
const RESULT_LIMIT = 30

export function TransferMarket({
  players,
  clubsById,
  clubBalance,
  onSign,
}: {
  players: Player[]
  clubsById: Map<string, Club>
  clubBalance: number
  onSign: (playerId: string) => void
}) {
  const [position, setPosition] = useState<PlayerPosition | 'All'>('All')
  const [query, setQuery] = useState('')
  const [freeAgentsOnly, setFreeAgentsOnly] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return players
      .filter((p) => position === 'All' || p.position === position)
      .filter((p) => !freeAgentsOnly || p.clubId === null)
      .filter((p) => !q || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q))
      .sort((a, b) => computeOverall(b.attributes) - computeOverall(a.attributes))
  }, [players, position, query, freeAgentsOnly])

  const visible = filtered.slice(0, RESULT_LIMIT)
  const selected = visible.find((p) => p.id === selectedId)

  return (
    <div className="mt-6">
      <h2 className="border-l-4 border-[var(--color-pitch)] pl-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-chalk)]">
        Transfer Market
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search player name"
          className="rounded border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-chalk)] placeholder:text-[var(--color-chalk-dim)] focus:border-[var(--color-pitch)] focus:outline-none"
        />
        <div className="flex gap-1">
          {POSITIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPosition(p)}
              className={`transition-standard cursor-pointer rounded border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                position === p
                  ? 'border-[var(--color-pitch)] bg-[var(--color-pitch)] text-[var(--color-night)]'
                  : 'border-[var(--color-line)] text-[var(--color-chalk-dim)] hover:text-[var(--color-chalk)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--color-chalk-dim)]">
          <input
            type="checkbox"
            checked={freeAgentsOnly}
            onChange={(e) => setFreeAgentsOnly(e.target.checked)}
          />
          Free agents only
        </label>
      </div>

      <p className="mt-2 text-[10px] text-[var(--color-chalk-dim)]">
        Showing {visible.length} of {filtered.length} matching players
      </p>

      <table className="mt-2 w-full text-left text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
            <th className="py-1.5 font-medium">Player</th>
            <th className="py-1.5 font-medium">Club</th>
            <th className="py-1.5 font-medium">Pos</th>
            <th className="py-1.5 text-right font-medium">Age</th>
            <th className="py-1.5 text-right font-medium">OVR</th>
            <th className="font-mono-num py-1.5 text-right font-medium">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-line)]">
          {visible.map((player) => (
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
              <td className="py-1.5 text-[var(--color-chalk-dim)]">
                {player.clubId ? (clubsById.get(player.clubId)?.name ?? '—') : 'Free Agent'}
              </td>
              <td className="py-1.5 text-[var(--color-chalk-dim)]">{player.position}</td>
              <td className="font-mono-num py-1.5 text-right text-[var(--color-chalk-dim)]">
                {player.age}
              </td>
              <td className="font-mono-num py-1.5 text-right text-[var(--color-chalk)]">
                {computeOverall(player.attributes)}
              </td>
              <td className="font-mono-num led-amber py-1.5 text-right">
                {player.clubId ? `$${player.value.toLocaleString()}` : 'Free'}
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-[var(--color-chalk-dim)]">
                No players match those filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selected && (
        <div className="mt-4">
          <PlayerDetailPanel
            player={selected}
            clubName={selected.clubId ? clubsById.get(selected.clubId)?.name : undefined}
            action={{
              label: selected.clubId ? 'Sign' : 'Sign (Free)',
              onClick: () => onSign(selected.id),
              disabled: (selected.clubId ? selected.value : 0) > clubBalance,
            }}
          />
        </div>
      )}
    </div>
  )
}
