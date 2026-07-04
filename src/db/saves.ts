import { nanoid } from 'nanoid'
import { db } from './db'
import { generateWorld } from '../data/worldGen'
import { hashStringToSeed } from '../lib/rng'
import { STARTING_CASH } from '../data/constants'
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

export interface SaveBundle {
  save: SaveGame
  leagues: League[]
  clubs: Club[]
  stadiums: Stadium[]
  players: Player[]
  transfers: Transfer[]
  ledger: LedgerEntry[]
  fanMood: FanMood[]
}

export async function listSaves(): Promise<SaveGame[]> {
  return db.saves.orderBy('updatedAt').reverse().toArray()
}

export async function createSave(name: string): Promise<SaveGame> {
  const id = nanoid()
  const now = new Date().toISOString()
  const seed = hashStringToSeed(id)
  const save: SaveGame = {
    id,
    name,
    seed,
    createdAt: now,
    updatedAt: now,
    ownedClubId: null,
    cash: STARTING_CASH,
    currentDate: now,
  }

  const world = generateWorld(id, seed)

  await db.transaction(
    'rw',
    [db.saves, db.leagues, db.clubs, db.stadiums, db.players],
    async () => {
      await db.saves.add(save)
      await db.leagues.bulkAdd(world.leagues)
      await db.clubs.bulkAdd(world.clubs)
      await db.stadiums.bulkAdd(world.stadiums)
      await db.players.bulkAdd(world.players)
    },
  )

  return save
}

export async function deleteSave(saveId: string): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.saves,
      db.leagues,
      db.clubs,
      db.stadiums,
      db.players,
      db.transfers,
      db.ledger,
      db.fanMood,
    ],
    async () => {
      await db.saves.delete(saveId)
      await db.leagues.where('saveId').equals(saveId).delete()
      await db.clubs.where('saveId').equals(saveId).delete()
      await db.stadiums.where('saveId').equals(saveId).delete()
      await db.players.where('saveId').equals(saveId).delete()
      await db.transfers.where('saveId').equals(saveId).delete()
      await db.ledger.where('saveId').equals(saveId).delete()
      await db.fanMood.where('saveId').equals(saveId).delete()
    },
  )
}

export async function loadSaveBundle(saveId: string): Promise<SaveBundle | undefined> {
  const save = await db.saves.get(saveId)
  if (!save) return undefined

  const [leagues, clubs, stadiums, players, transfers, ledger, fanMood] = await Promise.all([
    db.leagues.where('saveId').equals(saveId).toArray(),
    db.clubs.where('saveId').equals(saveId).toArray(),
    db.stadiums.where('saveId').equals(saveId).toArray(),
    db.players.where('saveId').equals(saveId).toArray(),
    db.transfers.where('saveId').equals(saveId).toArray(),
    db.ledger.where('saveId').equals(saveId).toArray(),
    db.fanMood.where('saveId').equals(saveId).toArray(),
  ])

  return { save, leagues, clubs, stadiums, players, transfers, ledger, fanMood }
}

export async function exportSaveToJson(saveId: string): Promise<string> {
  const bundle = await loadSaveBundle(saveId)
  if (!bundle) throw new Error(`Save ${saveId} not found`)
  return JSON.stringify(bundle, null, 2)
}

export async function importSaveFromJson(json: string): Promise<SaveGame> {
  const bundle = JSON.parse(json) as SaveBundle
  if (!bundle?.save?.id) throw new Error('Invalid save file')

  await db.transaction(
    'rw',
    [
      db.saves,
      db.leagues,
      db.clubs,
      db.stadiums,
      db.players,
      db.transfers,
      db.ledger,
      db.fanMood,
    ],
    async () => {
      await db.saves.put(bundle.save)
      if (bundle.leagues.length) await db.leagues.bulkPut(bundle.leagues)
      if (bundle.clubs.length) await db.clubs.bulkPut(bundle.clubs)
      if (bundle.stadiums.length) await db.stadiums.bulkPut(bundle.stadiums)
      if (bundle.players.length) await db.players.bulkPut(bundle.players)
      if (bundle.transfers.length) await db.transfers.bulkPut(bundle.transfers)
      if (bundle.ledger.length) await db.ledger.bulkPut(bundle.ledger)
      if (bundle.fanMood.length) await db.fanMood.bulkPut(bundle.fanMood)
    },
  )

  return bundle.save
}
