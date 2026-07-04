import { nanoid } from 'nanoid'
import type { Club, League, Stadium } from '../types/models'
import { mulberry32, randomInRange } from '../lib/rng'
import { LEAGUE_SEEDS } from './clubSeed'

export interface GeneratedWorld {
  leagues: League[]
  clubs: Club[]
  stadiums: Stadium[]
}

/** Builds a fresh league/club/stadium world for one save, deterministic from its seed. */
export function generateWorld(saveId: string, seed: number): GeneratedWorld {
  const rng = mulberry32(seed)
  const leagues: League[] = []
  const clubs: Club[] = []
  const stadiums: Stadium[] = []

  for (const leagueSeed of LEAGUE_SEEDS) {
    const league: League = {
      id: nanoid(),
      saveId,
      country: leagueSeed.country,
      tier: leagueSeed.tier,
      name: leagueSeed.name,
    }
    leagues.push(league)

    for (const clubName of leagueSeed.clubs) {
      const isTopFlight = leagueSeed.tier === 1
      const reputation = isTopFlight
        ? randomInRange(rng, 70, 95)
        : randomInRange(rng, 35, 65)
      const balance = isTopFlight
        ? randomInRange(rng, 5_000_000, 80_000_000)
        : randomInRange(rng, 50_000, 2_000_000)
      const askingPrice = isTopFlight
        ? Math.round(balance * 2.5 + reputation * 250_000)
        : randomInRange(rng, 20_000, 300_000)

      const stadiumId = nanoid()
      const clubId = nanoid()

      clubs.push({
        id: clubId,
        saveId,
        name: clubName,
        country: leagueSeed.country,
        leagueId: league.id,
        tier: leagueSeed.tier,
        reputation,
        balance,
        askingPrice,
        stadiumId,
        ownedByPlayer: false,
      })

      stadiums.push({
        id: stadiumId,
        saveId,
        clubId,
        capacity: isTopFlight
          ? randomInRange(rng, 25_000, 80_000)
          : randomInRange(rng, 5_000, 20_000),
        ticketPrice: isTopFlight ? randomInRange(rng, 30, 90) : randomInRange(rng, 10, 30),
        pitchQuality: isTopFlight ? randomInRange(rng, 60, 90) : randomInRange(rng, 30, 70),
        facilityQuality: isTopFlight ? randomInRange(rng, 60, 90) : randomInRange(rng, 30, 70),
      })
    }
  }

  return { leagues, clubs, stadiums }
}
