import { useMemo, useState } from 'react'
import type { Club, Player, PlayerPosition } from '../types/models'
import { computeOverall } from '../data/playerGen'
import { PlayerDetailPanel } from './PlayerDetailPanel'

const POSITIONS: (PlayerPosition | 'All')[] = ['All', 'GK', 'DEF', 'MID', 'FWD']
const PAGE_SIZE = 25

function parseBound(raw: string): number | null {
  if (raw.trim() === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

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
  const [freeAgentsOnly, setFreeAgentsOnly] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minOverall, setMinOverall] = useState('')
  const [maxOverall, setMaxOverall] = useState('')
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const minPriceN = parseBound(minPrice)
  const maxPriceN = parseBound(maxPrice)
  const minOverallN = parseBound(minOverall)
  const maxOverallN = parseBound(maxOverall)

  function resetPage() {
    setPage(0)
  }

  const filtered = useMemo(() => {
    return players
      .filter((p) => position === 'All' || p.position === position)
      .filter((p) => !freeAgentsOnly || p.clubId === null)
      .filter((p) => minPriceN === null || p.value >= minPriceN)
      .filter((p) => maxPriceN === null || p.value <= maxPriceN)
      .filter((p) => {
        const overall = computeOverall(p.attributes)
        return (minOverallN === null || overall >= minOverallN) && (maxOverallN === null || overall <= maxOverallN)
      })
      .sort((a, b) => computeOverall(b.attributes) - computeOverall(a.attributes))
  }, [players, position, freeAgentsOnly, minPriceN, maxPriceN, minOverallN, maxOverallN])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount - 1)
  const visible = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE)
  const selected = visible.find((p) => p.id === selectedId)

  const inputClass =
    'w-20 rounded border border-[var(--color-line)] bg-[var(--color-surface)] px-2 py-1.5 text-xs text-[var(--color-chalk)] placeholder:text-[var(--color-chalk-dim)] focus:border-[var(--color-pitch)] focus:outline-none'

  return (
    <div className="mt-6">
      <h2 className="border-l-4 border-[var(--color-pitch)] pl-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-chalk)]">
        Transfer Market
      </h2>

      <div className="mt-3 flex flex-wrap items-end gap-4">
        <div className="flex gap-1">
          {POSITIONS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setPosition(p)
                resetPage()
              }}
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

        <div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
            Price range
          </div>
          <div className="mt-1 flex items-center gap-1">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value)
                resetPage()
              }}
              placeholder="Min"
              className={inputClass}
            />
            <span className="text-[var(--color-chalk-dim)]">–</span>
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value)
                resetPage()
              }}
              placeholder="Max"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
            Overall range
          </div>
          <div className="mt-1 flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={99}
              value={minOverall}
              onChange={(e) => {
                setMinOverall(e.target.value)
                resetPage()
              }}
              placeholder="Min"
              className={inputClass}
            />
            <span className="text-[var(--color-chalk-dim)]">–</span>
            <input
              type="number"
              min={1}
              max={99}
              value={maxOverall}
              onChange={(e) => {
                setMaxOverall(e.target.value)
                resetPage()
              }}
              placeholder="Max"
              className={inputClass}
            />
          </div>
        </div>

        <label className="mb-1.5 flex cursor-pointer items-center gap-1.5 text-xs text-[var(--color-chalk-dim)]">
          <input
            type="checkbox"
            checked={freeAgentsOnly}
            onChange={(e) => {
              setFreeAgentsOnly(e.target.checked)
              resetPage()
            }}
          />
          Free agents only
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--color-chalk-dim)]">
        <span>{filtered.length} matching players</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={pageSafe === 0}
            className="transition-standard cursor-pointer rounded border border-[var(--color-line)] px-2 py-1 font-semibold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {pageSafe + 1} of {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={pageSafe >= pageCount - 1}
            className="transition-standard cursor-pointer rounded border border-[var(--color-line)] px-2 py-1 font-semibold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

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
