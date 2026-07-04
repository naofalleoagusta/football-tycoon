import { useState } from 'react'
import { useGameStore } from '../state/useGameStore'
import type { Country } from '../types/models'
import { MyClubPanel } from './MyClubPanel'
import { SquadView } from './SquadView'
import { TransferMarket } from './TransferMarket'

type View = 'Leagues' | 'Squad' | 'Transfer Market'

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
  const buyClub = useGameStore((s) => s.buyClub)
  const sellClub = useGameStore((s) => s.sellClub)
  const signPlayer = useGameStore((s) => s.signPlayer)
  const releasePlayer = useGameStore((s) => s.releasePlayer)
  const error = useGameStore((s) => s.error)
  const clearError = useGameStore((s) => s.clearError)
  const [country, setCountry] = useState<Country | 'All'>('All')
  const [view, setView] = useState<View>('Leagues')

  if (!bundle) return null

  const countries: Country[] = ['England', 'Spain', 'Italy', 'France', 'Portugal']
  const leagues = bundle.leagues
    .filter((l) => country === 'All' || l.country === country)
    .sort((a, b) => a.country.localeCompare(b.country) || a.tier - b.tier)

  const ownedClub = bundle.save.ownedClubId
    ? bundle.clubs.find((c) => c.id === bundle.save.ownedClubId)
    : undefined
  const ownedStadium = ownedClub
    ? bundle.stadiums.find((s) => s.clubId === ownedClub.id)
    : undefined
  const clubsById = new Map(bundle.clubs.map((c) => [c.id, c]))
  const squad = ownedClub ? bundle.players.filter((p) => p.clubId === ownedClub.id) : []
  const marketPlayers = ownedClub
    ? bundle.players.filter((p) => p.clubId !== ownedClub.id)
    : []

  async function handleExport() {
    const json = await exportActiveSave()
    downloadFile(`${bundle!.save.name.replace(/\s+/g, '-').toLowerCase()}.json`, json)
  }

  function handleSell() {
    if (!ownedClub) return
    if (window.confirm(`Sell ${ownedClub.name}? You'll get back part of its asking price.`)) {
      sellClub()
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Scoreboard header */}
      <div className="flex items-start justify-between gap-4 border-t-4 border-b-4 border-[var(--color-pitch)] bg-[var(--color-surface)] px-5 py-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-chalk-dim)]">
            {ownedClub ? 'Club owned' : 'Free agent owner'}
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

      {error && (
        <div className="mt-3 flex items-center justify-between rounded border border-[var(--color-card-red)]/40 bg-[var(--color-card-red)]/10 px-3 py-2 text-xs text-[var(--color-card-red)]">
          <span>{error}</span>
          <button onClick={clearError} className="cursor-pointer font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {ownedClub && (
        <div className="mt-6">
          <MyClubPanel club={ownedClub} stadium={ownedStadium} onSell={handleSell} />
        </div>
      )}

      {ownedClub && (
        <div className="mt-6 flex flex-wrap gap-1 border-b border-[var(--color-line)]">
          {(['Leagues', 'Squad', 'Transfer Market'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`transition-standard cursor-pointer border-b-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
                view === v
                  ? 'border-[var(--color-pitch)] text-[var(--color-chalk)]'
                  : 'border-transparent text-[var(--color-chalk-dim)] hover:text-[var(--color-chalk)]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {ownedClub && view === 'Squad' && (
        <SquadView squad={squad} onRelease={releasePlayer} />
      )}

      {ownedClub && view === 'Transfer Market' && (
        <TransferMarket
          players={marketPlayers}
          clubsById={clubsById}
          clubBalance={ownedClub.balance}
          onSign={signPlayer}
        />
      )}

      {(!ownedClub || view === 'Leagues') && (
        <>
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
                        <th className="py-1.5 text-right font-medium" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-line)]">
                      {clubs.map((club) => {
                        const isMine = club.id === bundle.save.ownedClubId
                        const canAfford = bundle.save.cash >= club.askingPrice
                        const canBuy = !bundle.save.ownedClubId && !club.ownedByPlayer && canAfford
                        return (
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
                            <td className="py-1.5 text-right">
                              {isMine ? (
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-floodlight)]">
                                  Owned
                                </span>
                              ) : (
                                <button
                                  onClick={() => buyClub(club.id)}
                                  disabled={!canBuy}
                                  title={
                                    bundle.save.ownedClubId
                                      ? 'Sell your club first'
                                      : !canAfford
                                        ? 'Not enough cash'
                                        : undefined
                                  }
                                  className="transition-standard cursor-pointer rounded border border-[var(--color-pitch)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-pitch)] hover:bg-[var(--color-pitch)] hover:text-[var(--color-night)] disabled:cursor-not-allowed disabled:border-[var(--color-line)] disabled:text-[var(--color-chalk-dim)] disabled:hover:bg-transparent"
                                >
                                  Buy
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
