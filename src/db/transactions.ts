import { nanoid } from 'nanoid'
import { db } from './db'

const SELL_BACK_FRACTION = 0.85
const RELEASE_FRACTION = 0.7

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

/** Signs a player to the save's owned club — a flat-fee transfer (or free if
 *  the player has no current club) rather than a full bid/counter-offer flow. */
export async function signPlayer(saveId: string, playerId: string): Promise<void> {
  await db.transaction('rw', [db.saves, db.clubs, db.players, db.ledger], async () => {
    const save = await db.saves.get(saveId)
    if (!save) throw new Error('Save not found')
    if (!save.ownedClubId) throw new Error('You need a club before signing players')

    const player = await db.players.get(playerId)
    if (!player) throw new Error('Player not found')
    if (player.clubId === save.ownedClubId) throw new Error('Already on your squad')

    const buyingClub = await db.clubs.get(save.ownedClubId)
    if (!buyingClub) throw new Error('Club not found')

    const fee = player.clubId ? player.value : 0
    if (buyingClub.balance < fee) throw new Error("Club balance can't cover this transfer")

    const now = new Date().toISOString()
    await db.clubs.update(buyingClub.id, { balance: buyingClub.balance - fee })
    await db.players.update(playerId, {
      clubId: buyingClub.id,
      contractYears: player.contractYears < 2 ? 3 : player.contractYears,
    })
    await db.ledger.add({
      id: nanoid(),
      saveId,
      clubId: buyingClub.id,
      type: 'expense',
      category: 'transfer_in',
      amount: fee,
      date: now,
      note: `Signed ${player.firstName} ${player.lastName}`,
    })

    if (player.clubId) {
      const sellingClub = await db.clubs.get(player.clubId)
      if (sellingClub) {
        await db.clubs.update(sellingClub.id, { balance: sellingClub.balance + fee })
        await db.ledger.add({
          id: nanoid(),
          saveId,
          clubId: sellingClub.id,
          type: 'income',
          category: 'transfer_out',
          amount: fee,
          date: now,
          note: `Sold ${player.firstName} ${player.lastName}`,
        })
      }
    }
  })
}

/** Releases a player from the save's squad onto the free-agent market, crediting
 *  the club balance a discounted fraction of the player's value. */
export async function releasePlayer(saveId: string, playerId: string): Promise<void> {
  await db.transaction('rw', [db.saves, db.clubs, db.players, db.ledger], async () => {
    const player = await db.players.get(playerId)
    if (!player) throw new Error('Player not found')

    const save = await db.saves.get(saveId)
    if (!save?.ownedClubId || player.clubId !== save.ownedClubId) {
      throw new Error('Not your player')
    }

    const club = await db.clubs.get(save.ownedClubId)
    if (!club) throw new Error('Club not found')

    const fee = Math.round(player.value * RELEASE_FRACTION)
    const now = new Date().toISOString()
    await db.clubs.update(club.id, { balance: club.balance + fee })
    await db.players.update(playerId, { clubId: null })
    await db.ledger.add({
      id: nanoid(),
      saveId,
      clubId: club.id,
      type: 'income',
      category: 'player_release',
      amount: fee,
      date: now,
      note: `Released ${player.firstName} ${player.lastName}`,
    })
  })
}
