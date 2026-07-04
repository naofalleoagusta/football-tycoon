import type { Player } from '../types/models'
import { computeOverall } from '../data/playerGen'
import { StatBar } from './StatBar'

export function PlayerDetailPanel({
  player,
  clubName,
  action,
}: {
  player: Player
  clubName?: string
  action?: { label: string; onClick: () => void; disabled?: boolean; tone?: 'buy' | 'sell' }
}) {
  const overall = computeOverall(player.attributes)

  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-surface-raised)] px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-chalk-dim)]">
            {player.position} · {player.nationality} · Age {player.age}
            {clubName ? ` · ${clubName}` : ' · Free Agent'}
          </div>
          <h3 className="font-display text-xl leading-none text-[var(--color-chalk)]">
            {player.firstName} {player.lastName}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-chalk-dim)]">
            Value
          </div>
          <div className="font-mono-num led-amber text-lg">${player.value.toLocaleString()}</div>
          {action && (
            <button
              onClick={action.onClick}
              disabled={action.disabled}
              className={`transition-standard mt-2 cursor-pointer rounded border px-3 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:border-[var(--color-line)] disabled:text-[var(--color-chalk-dim)] ${
                action.tone === 'sell'
                  ? 'border-[var(--color-card-red)]/40 text-[var(--color-card-red)] hover:bg-[var(--color-card-red)]/10'
                  : 'border-[var(--color-pitch)] text-[var(--color-pitch)] hover:bg-[var(--color-pitch)] hover:text-[var(--color-night)]'
              }`}
            >
              {action.label}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-5">
        <StatBar label="Pace" value={player.attributes.pace} />
        <StatBar label="Shooting" value={player.attributes.shooting} />
        <StatBar label="Passing" value={player.attributes.passing} />
        <StatBar label="Defending" value={player.attributes.defending} />
        <StatBar label="Physical" value={player.attributes.physical} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:grid-cols-4">
        <div>
          <div className="uppercase tracking-wide text-[var(--color-chalk-dim)]">Overall</div>
          <div className="font-mono-num text-[var(--color-chalk)]">{overall}</div>
        </div>
        <div>
          <div className="uppercase tracking-wide text-[var(--color-chalk-dim)]">Potential</div>
          <div className="font-mono-num text-[var(--color-chalk)]">{player.potential}</div>
        </div>
        <div>
          <div className="uppercase tracking-wide text-[var(--color-chalk-dim)]">Wage</div>
          <div className="font-mono-num text-[var(--color-chalk)]">${player.wage}/wk</div>
        </div>
        <div>
          <div className="uppercase tracking-wide text-[var(--color-chalk-dim)]">Contract</div>
          <div className="font-mono-num text-[var(--color-chalk)]">
            {player.contractYears} {player.contractYears === 1 ? 'year' : 'years'}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-8 sm:w-1/2">
        <StatBar label="Morale" value={player.morale} color="var(--color-floodlight)" />
        <div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--color-chalk-dim)]">
            Form
          </div>
          <div className="mt-1 text-xs text-[var(--color-chalk-dim)]">— no matches played yet</div>
        </div>
      </div>
    </div>
  )
}
