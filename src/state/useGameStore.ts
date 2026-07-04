import { create } from 'zustand'
import type { SaveGame } from '../types/models'
import {
  createSave,
  deleteSave,
  exportSaveToJson,
  importSaveFromJson,
  listSaves,
  loadSaveBundle,
  type SaveBundle,
} from '../db/saves'
import { buyClub, releasePlayer, sellClub, signPlayer } from '../db/transactions'

interface GameState {
  saves: SaveGame[]
  activeBundle: SaveBundle | null
  loading: boolean
  error: string | null
  refreshSaves: () => Promise<void>
  newSave: (name: string) => Promise<void>
  openSave: (saveId: string) => Promise<void>
  removeSave: (saveId: string) => Promise<void>
  closeSave: () => void
  exportActiveSave: () => Promise<string>
  importSave: (json: string) => Promise<void>
  buyClub: (clubId: string) => Promise<void>
  sellClub: () => Promise<void>
  signPlayer: (playerId: string) => Promise<void>
  releasePlayer: (playerId: string) => Promise<void>
  clearError: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  saves: [],
  activeBundle: null,
  loading: false,
  error: null,

  refreshSaves: async () => {
    const saves = await listSaves()
    set({ saves })
  },

  newSave: async (name: string) => {
    set({ loading: true })
    await createSave(name)
    await get().refreshSaves()
    set({ loading: false })
  },

  openSave: async (saveId: string) => {
    set({ loading: true })
    const bundle = await loadSaveBundle(saveId)
    set({ activeBundle: bundle ?? null, loading: false })
  },

  removeSave: async (saveId: string) => {
    await deleteSave(saveId)
    if (get().activeBundle?.save.id === saveId) set({ activeBundle: null })
    await get().refreshSaves()
  },

  closeSave: () => set({ activeBundle: null }),

  exportActiveSave: async () => {
    const id = get().activeBundle?.save.id
    if (!id) throw new Error('No active save to export')
    return exportSaveToJson(id)
  },

  importSave: async (json: string) => {
    await importSaveFromJson(json)
    await get().refreshSaves()
  },

  buyClub: async (clubId: string) => {
    await runTransaction(get, (saveId) => buyClub(saveId, clubId))
  },

  sellClub: async () => {
    await runTransaction(get, (saveId) => sellClub(saveId))
  },

  signPlayer: async (playerId: string) => {
    await runTransaction(get, (saveId) => signPlayer(saveId, playerId))
  },

  releasePlayer: async (playerId: string) => {
    await runTransaction(get, (saveId) => releasePlayer(saveId, playerId))
  },

  clearError: () => set({ error: null }),
}))

async function runTransaction(
  get: () => GameState,
  action: (saveId: string) => Promise<void>,
): Promise<void> {
  const saveId = get().activeBundle?.save.id
  if (!saveId) return
  try {
    await action(saveId)
    const bundle = await loadSaveBundle(saveId)
    useGameStore.setState({ activeBundle: bundle ?? null, error: null })
    await get().refreshSaves()
  } catch (err) {
    useGameStore.setState({ error: err instanceof Error ? err.message : String(err) })
  }
}
