import { useRef, useState } from 'react'
import { useGameStore } from '../state/useGameStore'

export function SaveList() {
  const saves = useGameStore((s) => s.saves)
  const newSave = useGameStore((s) => s.newSave)
  const openSave = useGameStore((s) => s.openSave)
  const removeSave = useGameStore((s) => s.removeSave)
  const importSave = useGameStore((s) => s.importSave)
  const [name, setName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    await newSave(trimmed)
    setName('')
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    await importSave(text)
    e.target.value = ''
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 font-sans">
      <h1 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-white">
        Football Tycoon
      </h1>
      <p className="mt-1 text-sm text-white/60">
        Offline save slots, stored locally on this device.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="New save name"
          className="flex-1 rounded border border-white/10 bg-[var(--color-surface)] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[var(--color-pitch-primary)] focus:outline-none"
        />
        <button
          onClick={handleCreate}
          className="cursor-pointer rounded bg-[var(--color-pitch-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-pitch-secondary)]"
        >
          Create Save
        </button>
      </div>

      <ul className="mt-8 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {saves.length === 0 && (
          <li className="py-6 text-center text-sm text-white/50">No saves yet. Create one above.</li>
        )}
        {saves.map((save) => (
          <li key={save.id} className="flex items-center justify-between gap-4 py-3">
            <div>
              <div className="font-medium text-white">{save.name}</div>
              <div className="text-xs text-white/50">
                Cash ${save.cash.toLocaleString()} · updated{' '}
                {new Date(save.updatedAt).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openSave(save.id)}
                className="cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/5"
              >
                Open
              </button>
              <button
                onClick={() => removeSave(save.id)}
                className="cursor-pointer rounded border border-[var(--color-destructive)]/40 px-3 py-1.5 text-xs font-medium text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer text-xs font-medium text-white/60 underline underline-offset-2 hover:text-white"
        >
          Import save from file
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
      </div>
    </div>
  )
}
