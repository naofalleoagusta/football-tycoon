import { nanoid } from 'nanoid'
import { db } from './db'

const SELL_BACK_FRACTION = 0.85

export async function buyClub(saveId: string, clubId: string): Promise<void> {
  await db.transaction('rw', [db.saves, db.clubs, db.ledger], async () => {
    const save = await db.saves.get(saveId)
    const club = await db.clubs.get(clubId)
    if (!save) throw new Error('Save not found')
    if (!club) throw new Error('Club not found')
    if (save.ownedClubId) throw new Error('You already own a club — sell it first')
    if (club.ownedByPlayer) throw new Error('Club is already owned')
    if (save.cash < club.askingPrice) throw new Error('Not enough cash')

    const now = new Date().toISOString()
    await db.saves.update(saveId, {
      cash: save.cash - club.askingPrice,
      ownedClubId: clubId,
      updatedAt: now,
    })
    await db.clubs.update(clubId, { ownedByPlayer: true })
    await db.ledger.add({
      id: nanoid(),
      saveId,
      clubId,
      type: 'expense',
      category: 'club_purchase',
      amount: club.askingPrice,
      date: now,
      note: `Bought ${club.name}`,
    })
  })
}

export async function sellClub(saveId: string): Promise<void> {
  await db.transaction('rw', [db.saves, db.clubs, db.ledger], async () => {
    const save = await db.saves.get(saveId)
    if (!save) throw new Error('Save not found')
    if (!save.ownedClubId) throw new Error('No club owned')
    const club = await db.clubs.get(save.ownedClubId)
    if (!club) throw new Error('Club not found')

    const salePrice = Math.round(club.askingPrice * SELL_BACK_FRACTION)
    const now = new Date().toISOString()
    await db.saves.update(saveId, {
      cash: save.cash + salePrice,
      ownedClubId: null,
      updatedAt: now,
    })
    await db.clubs.update(club.id, { ownedByPlayer: false })
    await db.ledger.add({
      id: nanoid(),
      saveId,
      clubId: club.id,
      type: 'income',
      category: 'club_sale',
      amount: salePrice,
      date: now,
      note: `Sold ${club.name}`,
    })
  })
}
