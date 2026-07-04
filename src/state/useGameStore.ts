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

interface GameState {
  saves: SaveGame[]
  activeBundle: SaveBundle | null
  loading: boolean
  refreshSaves: () => Promise<void>
  newSave: (name: string) => Promise<void>
  openSave: (saveId: string) => Promise<void>
  removeSave: (saveId: string) => Promise<void>
  closeSave: () => void
  exportActiveSave: () => Promise<string>
  importSave: (json: string) => Promise<void>
}

export const useGameStore = create<GameState>((set, get) => ({
  saves: [],
  activeBundle: null,
  loading: false,

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
}))
