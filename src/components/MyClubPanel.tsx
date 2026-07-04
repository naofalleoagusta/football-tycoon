import type { Club, Stadium } from '../types/models'
import { StatBar } from './StatBar'

export function MyClubPanel({
  club,
  stadium,
  onSell,
}: {
  club: Club
  stadium: Stadium | undefined
  onSell: () => void
}) {
  return (
    <div className="border-t-4 border-b-4 border-[var(--color-floodlight)] bg-[var(--color-surface)] px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-chalk-dim)]">
            {club.country} · Tier {club.tier}
          </div>
          <h2 className="font-display text-2xl leading-none text-[var(--color-chalk)]">
            {club.name}
          </h2>
          <div className="mt-2 text-xs text-[var(--color-chalk-dim)]">
            League position <span className="text-[var(--color-chalk)]">— season not started</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-chalk-dim)]">
            Club Balance
          </div>
          <div className="font-mono-num led-amber text-2xl">${club.balance.toLocaleString()}</div>
          <button
            onClick={onSell}
            className="transition-standard mt-2 cursor-pointer rounded border border-[var(--color-card-red)]/40 px-3 py-1 text-xs font-medium text-[var(--color-card-red)] hover:bg-[var(--color-card-red)]/10"
          >
            Sell Club
          </button>
        </div>
      </div>

      {stadium && (
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
              Capacity
            </div>
            <div className="font-mono-num text-[var(--color-chalk)]">
              {stadium.capacity.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
              Ticket Price
            </div>
            <div className="font-mono-num text-[var(--color-chalk)]">${stadium.ticketPrice}</div>
          </div>
          <StatBar label="Pitch Quality" value={stadium.pitchQuality} />
          <StatBar label="Facilities" value={stadium.facilityQuality} />
        </div>
      )}
    </div>
  )
}
