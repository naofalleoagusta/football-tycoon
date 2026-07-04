export type LeagueTier = 1 | 2

export type Country = 'England' | 'Spain' | 'Italy' | 'France' | 'Portugal'

export interface League {
  id: string
  saveId: string
  country: Country
  tier: LeagueTier
  name: string
}

export interface Stadium {
  id: string
  saveId: string
  clubId: string
  capacity: number
  ticketPrice: number
  pitchQuality: number // 0-100
  facilityQuality: number // 0-100
}

export interface Club {
  id: string
  saveId: string
  name: string
  country: Country
  leagueId: string
  tier: LeagueTier
  reputation: number // 1-100
  balance: number
  askingPrice: number
  stadiumId: string
  ownedByPlayer: boolean
}

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD'

export interface PlayerAttributes {
  pace: number
  shooting: number
  passing: number
  defending: number
  physical: number
}

export interface Player {
  id: string
  saveId: string
  clubId: string | null
  firstName: string
  lastName: string
  nationality: Country
  age: number
  position: PlayerPosition
  attributes: PlayerAttributes
  potential: number
  wage: number
  value: number
  contractYears: number
}

export interface Transfer {
  id: string
  saveId: string
  playerId: string
  fromClubId: string | null
  toClubId: string
  fee: number
  date: string
}

export type LedgerEntryType = 'income' | 'expense' | 'owner_deposit' | 'owner_withdrawal'

export interface LedgerEntry {
  id: string
  saveId: string
  clubId: string
  type: LedgerEntryType
  category: string
  amount: number
  date: string
  note?: string
}

export interface FanMood {
  saveId: string
  clubId: string
  mood: number // 0-100
  lastUpdated: string
}

export interface SaveGame {
  id: string
  name: string
  seed: number
  createdAt: string
  updatedAt: string
  ownedClubId: string | null
  cash: number
  currentDate: string
}
