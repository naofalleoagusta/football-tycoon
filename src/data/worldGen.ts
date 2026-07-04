import { nanoid } from 'nanoid'
import type { Club, League, LeagueTier, Player, Stadium } from '../types/models'
import { mulberry32 } from '../lib/rng'
import { LEAGUE_SEEDS } from './clubSeed'
import { generateSquad } from './playerGen'

export interface GeneratedWorld {
  leagues: League[]
  clubs: Club[]
  stadiums: Stadium[]
  players: Player[]
}

interface TierRange {
  reputation: [number, number]
  balance: [number, number]
  askingPrice: [number, number] | null // null = computed from balance/reputation
  capacity: [number, number]
  ticketPrice: [number, number]
  pitchQuality: [number, number]
  facilityQuality: [number, number]
}

const TIER_RANGES: Record<LeagueTier, TierRange> = {
  1: {
    reputation: [70, 95],
    balance: [5_000_000, 80_000_000],
    askingPrice: null,
    capacity: [25_000, 80_000],
    ticketPrice: [30, 90],
    pitchQuality: [60, 90],
    facilityQuality: [60, 90],
  },
  2: {
    reputation: [35, 65],
    balance: [50_000, 2_000_000],
    askingPrice: [20_000, 300_000],
    capacity: [5_000, 20_000],
    ticketPrice: [10, 30],
    pitchQuality: [30, 70],
    facilityQuality: [30, 70],
  },
  3: {
    reputation: [15, 40],
    balance: [5_000, 200_000],
    askingPrice: [5_000, 50_000],
    capacity: [2_000, 8_000],
    ticketPrice: [5, 15],
    pitchQuality: [20, 55],
    facilityQuality: [20, 55],
  },
  4: {
    reputation: [5, 25],
    balance: [1_000, 50_000],
    askingPrice: [1_000, 15_000],
    capacity: [500, 3_000],
    ticketPrice: [3, 8],
    pitchQuality: [10, 40],
    facilityQuality: [10, 40],
  },
}

/** Jitter as a fraction of the tier range width, so stature mostly holds but two
 *  clubs of similar prestige can still swap places run to run. */
const JITTER_FRACTION = 0.05

/** Scales a stat by real-world prestige within a tier's range, so a big name
 *  can't randomly land below a small one — with a little noise on top. */
function fromPrestige(rng: () => number, prestige: number, [min, max]: [number, number]): number {
  const width = max - min
  const base = min + prestige * width
  const noise = (rng() - 0.5) * 2 * JITTER_FRACTION * width
  return Math.round(Math.min(max, Math.max(min, base + noise)))
}

/** Builds a fresh league/club/stadium world for one save, deterministic from its seed. */
export function generateWorld(saveId: string, seed: number): GeneratedWorld {
  const rng = mulberry32(seed)
  const leagues: League[] = []
  const clubs: Club[] = []
  const stadiums: Stadium[] = []
  const players: Player[] = []
  const usedNames = new Set<string>()

  for (const leagueSeed of LEAGUE_SEEDS) {
    const league: League = {
      id: nanoid(),
      saveId,
      country: leagueSeed.country,
      tier: leagueSeed.tier,
      name: leagueSeed.name,
    }
    leagues.push(league)

    const range = TIER_RANGES[leagueSeed.tier]

    for (const clubSeed of leagueSeed.clubs) {
      const { prestige } = clubSeed
      const reputation = fromPrestige(rng, prestige, range.reputation)
      const balance = fromPrestige(rng, prestige, range.balance)
      const askingPrice = range.askingPrice
        ? fromPrestige(rng, prestige, range.askingPrice)
        : Math.round(balance * 2.5 + reputation * 250_000)

      const stadiumId = nanoid()
      const clubId = nanoid()

      clubs.push({
        id: clubId,
        saveId,
        name: clubSeed.name,
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
        capacity: fromPrestige(rng, prestige, range.capacity),
        ticketPrice: fromPrestige(rng, prestige, range.ticketPrice),
        pitchQuality: fromPrestige(rng, prestige, range.pitchQuality),
        facilityQuality: fromPrestige(rng, prestige, range.facilityQuality),
      })

      players.push(
        ...generateSquad(rng, saveId, clubId, leagueSeed.country, leagueSeed.tier, usedNames),
      )
    }
  }

  return { leagues, clubs, stadiums, players }
}
