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
    <div className="mx-auto max-w-4xl px-6 py-10 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-white">
            {bundle.save.name}
          </h1>
          <p className="text-sm text-white/60">
            Cash ${bundle.save.cash.toLocaleString()} ·{' '}
            {bundle.save.ownedClubId ? 'Club owned' : 'No club owned yet'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/5"
          >
            Export Save
          </button>
          <button
            onClick={closeSave}
            className="cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/5"
          >
            Back to saves
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setCountry('All')}
          className={`cursor-pointer rounded px-3 py-1 text-xs font-medium ${country === 'All' ? 'bg-[var(--color-pitch-primary)] text-white' : 'border border-white/15 text-white/70 hover:bg-white/5'}`}
        >
          All
        </button>
        {countries.map((c) => (
          <button
            key={c}
            onClick={() => setCountry(c)}
            className={`cursor-pointer rounded px-3 py-1 text-xs font-medium ${country === c ? 'bg-[var(--color-pitch-primary)] text-white' : 'border border-white/15 text-white/70 hover:bg-white/5'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-8">
        {leagues.map((league) => {
          const clubs = bundle.clubs
            .filter((c) => c.leagueId === league.id)
            .sort((a, b) => b.reputation - a.reputation)
          return (
            <div key={league.id}>
              <h2 className="border-b border-[var(--color-border)] pb-1 text-sm font-semibold uppercase tracking-wide text-white/70">
                {league.country} · {league.name} · Tier {league.tier}
              </h2>
              <table className="mt-2 w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase text-white/40">
                    <th className="py-1 font-medium">Club</th>
                    <th className="py-1 text-right font-medium">Reputation</th>
                    <th className="py-1 text-right font-medium tabular-nums">Balance</th>
                    <th className="py-1 text-right font-medium tabular-nums">Asking Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {clubs.map((club) => (
                    <tr key={club.id}>
                      <td className="py-1.5 text-white">{club.name}</td>
                      <td className="py-1.5 text-right text-white/70">{club.reputation}</td>
                      <td className="py-1.5 text-right tabular-nums text-white/70">
                        ${club.balance.toLocaleString()}
                      </td>
                      <td className="py-1.5 text-right tabular-nums text-[var(--color-accent)]">
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
