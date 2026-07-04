import { useState } from 'react'
import { useGameStore } from '../state/useGameStore'
import type { Country } from '../types/models'

function downloadFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function Dashboard() {
  const bundle = useGameStore((s) => s.activeBundle)
  const closeSave = useGameStore((s) => s.closeSave)
  const exportActiveSave = useGameStore((s) => s.exportActiveSave)
  const [country, setCountry] = useState<Country | 'All'>('All')

  if (!bundle) return null

  const countries: Country[] = ['England', 'Spain', 'Italy', 'France', 'Portugal']
  const leagues = bundle.leagues
    .filter((l) => country === 'All' || l.country === country)
    .sort((a, b) => a.country.localeCompare(b.country) || a.tier - b.tier)

  async function handleExport() {
    const json = await exportActiveSave()
    downloadFile(`${bundle!.save.name.replace(/\s+/g, '-').toLowerCase()}.json`, json)
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Scoreboard header */}
      <div className="flex items-start justify-between gap-4 border-t-4 border-b-4 border-[var(--color-pitch)] bg-[var(--color-surface)] px-5 py-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-chalk-dim)]">
            {bundle.save.ownedClubId ? 'Club owned' : 'Free agent owner'}
          </div>
          <h1 className="font-display text-3xl leading-none text-[var(--color-chalk)]">
            {bundle.save.name}
          </h1>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-chalk-dim)]">
            Cash
          </div>
          <div className="font-mono-num led-amber text-3xl">
            ${bundle.save.cash.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={handleExport}
          className="transition-standard cursor-pointer rounded border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium text-[var(--color-chalk)] hover:bg-white/5"
        >
          Export Save
        </button>
        <button
          onClick={closeSave}
          className="transition-standard cursor-pointer rounded border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium text-[var(--color-chalk)] hover:bg-white/5"
        >
          Back to saves
        </button>
      </div>

      {/* Channel tabs */}
      <div className="mt-8 flex flex-wrap gap-1 border-b border-[var(--color-line)]">
        {(['All', ...countries] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCountry(c)}
            className={`transition-standard cursor-pointer border-b-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
              country === c
                ? 'border-[var(--color-floodlight)] text-[var(--color-chalk)]'
                : 'border-transparent text-[var(--color-chalk-dim)] hover:text-[var(--color-chalk)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-10">
        {leagues.map((league) => {
          const clubs = bundle.clubs
            .filter((c) => c.leagueId === league.id)
            .sort((a, b) => b.reputation - a.reputation)
          return (
            <div key={league.id}>
              <h2 className="flex items-baseline gap-2 border-l-4 border-[var(--color-pitch)] pl-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-chalk)]">
                {league.country}
                <span className="text-[var(--color-chalk-dim)]">· {league.name}</span>
                <span className="text-[var(--color-chalk-dim)]">· Tier {league.tier}</span>
              </h2>
              <table className="mt-2 w-full text-left text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
                    <th className="py-1.5 font-medium">Club</th>
                    <th className="py-1.5 text-right font-medium">Rep</th>
                    <th className="font-mono-num py-1.5 text-right font-medium">Balance</th>
                    <th className="font-mono-num py-1.5 text-right font-medium">Asking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {clubs.map((club) => (
                    <tr key={club.id} className="transition-standard hover:bg-white/[0.03]">
                      <td className="py-1.5 text-[var(--color-chalk)]">{club.name}</td>
                      <td className="font-mono-num py-1.5 text-right text-[var(--color-chalk-dim)]">
                        {club.reputation}
                      </td>
                      <td className="font-mono-num py-1.5 text-right text-[var(--color-chalk-dim)]">
                        ${club.balance.toLocaleString()}
                      </td>
                      <td className="font-mono-num led-amber py-1.5 text-right">
                        ${club.askingPrice.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  )
}
