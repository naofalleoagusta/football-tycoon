import { useRef, useState } from 'react'
import { useGameStore } from '../state/useGameStore'

function TicketCard({
  name,
  cash,
  updatedAt,
  ticketNo,
  onOpen,
  onDelete,
}: {
  name: string
  cash: number
  updatedAt: string
  ticketNo: number
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex overflow-hidden rounded border border-[var(--color-line)] bg-[var(--color-surface)] shadow-[0_1px_0_rgba(0,0,0,0.4)]">
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-widest text-[var(--color-chalk-dim)]">
          <span>Admit One · Save #{String(ticketNo).padStart(4, '0')}</span>
          <span>{new Date(updatedAt).toLocaleDateString()}</span>
        </div>
        <div className="font-display mt-1 truncate text-2xl leading-none text-[var(--color-chalk)]">
          {name}
        </div>
        <div className="font-mono-num led-amber mt-3 text-lg">${cash.toLocaleString()}</div>
      </div>
      <div className="ticket-stub-divider flex w-16 flex-col items-center justify-between gap-2 py-3">
        <button
          onClick={onOpen}
          className="transition-standard cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[var(--color-pitch)] [writing-mode:vertical-rl] hover:text-[var(--color-chalk)]"
        >
          Open
        </button>
        <button
          onClick={onDelete}
          className="transition-standard cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[var(--color-card-red)]/70 [writing-mode:vertical-rl] hover:text-[var(--color-card-red)]"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

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
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="border-b-4 border-[var(--color-pitch)] pb-3">
        <h1 className="font-display text-4xl text-[var(--color-chalk)]">Football Tycoon</h1>
        <p className="mt-1 text-sm text-[var(--color-chalk-dim)]">
          Buy a real lower-division club, then run every side of it.
        </p>
      </div>

      {/* Programme sheet: what the game actually is, before asking for a save name */}
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t-4 border-b-4 border-[var(--color-pitch)] bg-[var(--color-surface)] px-5 py-5 sm:grid-cols-4 sm:gap-x-0">
        {[
          { label: 'Own the club', copy: 'Buy, sell, or bankroll a real-world team.' },
          { label: 'Deal players', copy: 'Generated squads, real transfer haggling.' },
          { label: 'Mind the fans', copy: 'Ticket prices and honesty keep them onside.' },
          { label: 'Grow the ground', copy: 'Pitch, stands, and floodlights need upkeep.' },
        ].map((item, i) => (
          <div
            key={item.label}
            className={i > 0 ? 'sm:border-l sm:border-dashed sm:border-[var(--color-line)] sm:pl-5' : ''}
          >
            <div className="font-display led-amber text-sm leading-none">{item.label}</div>
            <p className="mt-1.5 text-xs leading-snug text-[var(--color-chalk-dim)]">
              {item.copy}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-[var(--color-chalk-dim)]">
        Real clubs, four divisions deep, across{' '}
        <span className="text-[var(--color-chalk)]">
          England · Spain · Italy · France · Portugal
        </span>
        . Players are generated.
      </p>

      <h2 className="font-display mt-10 text-lg text-[var(--color-chalk)]">Start a career</h2>
      <div className="mt-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Name your career"
          className="flex-1 rounded border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-chalk)] placeholder:text-[var(--color-chalk-dim)] focus:border-[var(--color-pitch)] focus:outline-none"
        />
        <button
          onClick={handleCreate}
          className="transition-standard font-display cursor-pointer rounded bg-[var(--color-pitch)] px-5 py-2 text-sm tracking-wide text-[var(--color-night)] hover:bg-[var(--color-floodlight)]"
        >
          Kick Off
        </button>
      </div>

      {saves.length > 0 && (
        <h2 className="font-display mt-10 text-lg text-[var(--color-chalk)]">Continue a career</h2>
      )}
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {saves.map((save, i) => (
          <TicketCard
            key={save.id}
            ticketNo={saves.length - i}
            name={save.name}
            cash={save.cash}
            updatedAt={save.updatedAt}
            onOpen={() => openSave(save.id)}
            onDelete={() => removeSave(save.id)}
          />
        ))}
        {saves.length === 0 && (
          <div className="col-span-full rounded border border-dashed border-[var(--color-line)] py-10 text-center text-sm text-[var(--color-chalk-dim)]">
            No careers yet. Name one above and kick off.
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer text-xs font-medium text-[var(--color-chalk-dim)] underline underline-offset-2 hover:text-[var(--color-chalk)]"
        >
          Import a save file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImportFile}
        />
      </div>
    </div>
  )
}
