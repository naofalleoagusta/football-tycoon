import { nanoid } from 'nanoid'
import type { Country, LeagueTier, Player, PlayerAttributes, PlayerPosition } from '../types/models'
import { pickOne, randomInRange } from '../lib/rng'
import { NAME_POOLS } from './nameSeed'

const COUNTRIES: Country[] = ['England', 'Spain', 'Italy', 'France', 'Portugal']

/** Baseline overall-skill range a club's players are drawn from, by tier. */
const TIER_SKILL_RANGE: Record<LeagueTier, [number, number]> = {
  1: [62, 90],
  2: [45, 70],
  3: [32, 55],
  4: [20, 45],
}

/** Per-attribute offset from the tier baseline, so a position reads distinctly
 *  (a GK isn't just a defender with a lower number everywhere). */
const POSITION_PROFILE: Record<PlayerPosition, PlayerAttributes> = {
  GK: { pace: -20, shooting: -25, passing: -5, defending: 15, physical: 10 },
  DEF: { pace: -5, shooting: -15, passing: 0, defending: 20, physical: 10 },
  MID: { pace: 0, shooting: -5, passing: 15, defending: 0, physical: 0 },
  FWD: { pace: 10, shooting: 20, passing: -5, defending: -15, physical: 0 },
}

/** GK x2, DEF x6, MID x6, FWD x4 — an 18-player squad template. */
const SQUAD_TEMPLATE: PlayerPosition[] = [
  'GK', 'GK',
  'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF',
  'MID', 'MID', 'MID', 'MID', 'MID', 'MID',
  'FWD', 'FWD', 'FWD', 'FWD',
]

/** Tuned so a tier's best players land near that tier's club asking-price
 *  range (see worldGen's TIER_RANGES), not several times a whole club's worth. */
const TIER_VALUE_MULTIPLIER: Record<LeagueTier, number> = {
  1: 8000,
  2: 50,
  3: 10,
  4: 3,
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function computeOverall(attrs: PlayerAttributes): number {
  return Math.round((attrs.pace + attrs.shooting + attrs.passing + attrs.defending + attrs.physical) / 5)
}

function agingMultiplier(age: number): number {
  if (age <= 23) return 1.3
  if (age <= 29) return 1.1
  if (age <= 32) return 0.8
  return 0.5
}

function potentialFor(rng: () => number, overall: number, age: number): number {
  let bonus: [number, number]
  if (age <= 20) bonus = [15, 30]
  else if (age <= 23) bonus = [8, 18]
  else if (age <= 27) bonus = [2, 8]
  else bonus = [0, 2]
  return clamp(overall + randomInRange(rng, ...bonus), overall, 99)
}

export type GeneratedPlayer = Omit<Player, 'id' | 'saveId' | 'clubId'>

/** Picks a first/last name not already in use this save. Tries the
 *  nationality's own pool, then all pools combined, then finally
 *  disambiguates with a numeric suffix — so duplicates can't happen even
 *  once name pools run dry across ~1,800 generated players. */
function pickUniqueName(
  rng: () => number,
  nationality: Country,
  usedNames: Set<string>,
): { firstName: string; lastName: string } {
  const pool = NAME_POOLS[nationality]
  for (let attempt = 0; attempt < 20; attempt++) {
    const firstName = pickOne(rng, pool.first)
    const lastName = pickOne(rng, pool.last)
    const full = `${firstName} ${lastName}`
    if (!usedNames.has(full)) {
      usedNames.add(full)
      return { firstName, lastName }
    }
  }

  const allFirst = COUNTRIES.flatMap((c) => NAME_POOLS[c].first)
  const allLast = COUNTRIES.flatMap((c) => NAME_POOLS[c].last)
  for (let attempt = 0; attempt < 20; attempt++) {
    const firstName = pickOne(rng, allFirst)
    const lastName = pickOne(rng, allLast)
    const full = `${firstName} ${lastName}`
    if (!usedNames.has(full)) {
      usedNames.add(full)
      return { firstName, lastName }
    }
  }

  const firstName = pickOne(rng, pool.first)
  const baseLast = pickOne(rng, pool.last)
  let suffix = 2
  while (usedNames.has(`${firstName} ${baseLast} ${suffix}`)) suffix++
  const lastName = `${baseLast} ${suffix}`
  usedNames.add(`${firstName} ${lastName}`)
  return { firstName, lastName }
}

function generatePlayer(
  rng: () => number,
  position: PlayerPosition,
  clubCountry: Country,
  tier: LeagueTier,
  usedNames: Set<string>,
): GeneratedPlayer {
  const nationality = rng() < 0.7 ? clubCountry : pickOne(rng, COUNTRIES)
  const { firstName, lastName } = pickUniqueName(rng, nationality, usedNames)

  const [skillMin, skillMax] = TIER_SKILL_RANGE[tier]
  const profile = POSITION_PROFILE[position]
  const attributes: PlayerAttributes = {
    pace: clamp(randomInRange(rng, skillMin, skillMax) + profile.pace, 1, 99),
    shooting: clamp(randomInRange(rng, skillMin, skillMax) + profile.shooting, 1, 99),
    passing: clamp(randomInRange(rng, skillMin, skillMax) + profile.passing, 1, 99),
    defending: clamp(randomInRange(rng, skillMin, skillMax) + profile.defending, 1, 99),
    physical: clamp(randomInRange(rng, skillMin, skillMax) + profile.physical, 1, 99),
  }

  const age = randomInRange(rng, 17, 35)
  const overall = computeOverall(attributes)
  const potential = potentialFor(rng, overall, age)
  const value = Math.round(overall * overall * TIER_VALUE_MULTIPLIER[tier] * agingMultiplier(age))
  const wage = Math.max(50, Math.round(value / 150))

  return {
    firstName,
    lastName,
    nationality,
    age,
    position,
    attributes,
    potential,
    wage,
    value,
    contractYears: randomInRange(rng, 1, 5),
    morale: randomInRange(rng, 50, 90),
  }
}

export function generateSquad(
  rng: () => number,
  saveId: string,
  clubId: string,
  clubCountry: Country,
  tier: LeagueTier,
  usedNames: Set<string>,
): Player[] {
  return SQUAD_TEMPLATE.map((position) => ({
    id: nanoid(),
    saveId,
    clubId,
    ...generatePlayer(rng, position, clubCountry, tier, usedNames),
  }))
}
