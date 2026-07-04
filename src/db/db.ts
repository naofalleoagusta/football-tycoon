import Dexie, { type EntityTable } from 'dexie'
import type {
  Club,
  FanMood,
  LedgerEntry,
  League,
  Player,
  SaveGame,
  Stadium,
  Transfer,
} from '../types/models'

export class FootballTycoonDB extends Dexie {
  saves!: EntityTable<SaveGame, 'id'>
  leagues!: EntityTable<League, 'id'>
  clubs!: EntityTable<Club, 'id'>
  stadiums!: EntityTable<Stadium, 'id'>
  players!: EntityTable<Player, 'id'>
  transfers!: EntityTable<Transfer, 'id'>
  ledger!: EntityTable<LedgerEntry, 'id'>
  fanMood!: EntityTable<FanMood, 'clubId'>

  constructor() {
    super('football-tycoon')
    this.version(1).stores({
      saves: 'id, updatedAt',
      leagues: 'id, saveId, [saveId+country], tier',
      clubs: 'id, saveId, leagueId, ownedByPlayer, country',
      stadiums: 'id, saveId, clubId',
      players: 'id, saveId, clubId, position',
      transfers: 'id, saveId, playerId, toClubId, fromClubId',
      ledger: 'id, saveId, clubId, date, type',
      fanMood: 'clubId, saveId',
    })
  }
}

export const db = new FootballTycoonDB()
