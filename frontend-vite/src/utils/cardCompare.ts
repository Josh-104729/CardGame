// Card comparison utilities
import { Card } from './cardValidation'
import { guessValidationCheck } from './cardValidation'

const checkOneCard = (obj: Card[]): boolean => {
  return obj.length === 1 && obj[0].number !== 0
}

const checkTwinsCard = (obj: Card[]): boolean => {
  if (obj.length === 2) {
    if (obj[0].number === 0 && obj[1].number === 0) return false
    if (obj[0].number === obj[1].number && obj[0].number !== 0) {
      return true
    } else if (obj[0].number !== obj[1].number) {
      if (obj[0].number === 0 || obj[1].number === 0) return true
    }
  }
  return false
}

const checkTripletsCard = (obj: Card[]): boolean => {
  if (obj.length === 3) {
    if (obj[0].number === obj[1].number && obj[1].number === obj[2].number) {
      return true
    } else if (obj[0].number === obj[1].number && obj[2].number === 0) {
      return true
    } else if (obj[0].number === obj[2].number && obj[1].number === 0) {
      return true
    } else if (obj[1].number === obj[2].number && obj[0].number === 0) {
      return true
    }
  }
  return false
}

const checkQuadsCard = (obj: Card[]): boolean => {
  if (obj.length === 4) {
    if (
      obj[0].number === obj[1].number &&
      obj[1].number === obj[2].number &&
      obj[2].number === obj[3].number
    ) {
      return true
    }
  }
  return false
}

const checkBombCard = (obj: Card[]): boolean => {
  if (obj.length === 2) {
    if (obj[0].number === 0 && obj[1].number === 0) {
      return true
    }
  }
  return false
}

export const cardCompareUtil = (formerCards: Card[], laterCards: Card[]): boolean => {
  const guessFormer = guessValidationCheck(formerCards)
  const guessLater = guessValidationCheck(laterCards)

  let former = formerCards
  let later = laterCards

  if (guessFormer.guess_cards && guessFormer.guess_cards.length > 0) {
    former = guessFormer.guess_cards[0]
  }
  if (guessLater.guess_cards && guessLater.guess_cards.length > 0) {
    later = guessLater.guess_cards[0]
  }

  // If former is single card
  if (checkOneCard(former)) {
    if (checkOneCard(later)) {
      // Former played 2 (13)
      if (former[0].number === 13) {
        return false
      }
      // Later plays 2
      if (later[0].number === 13) {
        return true
      }
      // Later plays +1 higher
      if (later[0].number - former[0].number === 1) {
        return true
      }
    }
    // Later plays triplets, quads, or bomb
    if (checkTripletsCard(later) || checkQuadsCard(later) || checkBombCard(later)) {
      return true
    }
    return false
  }

  // If former is pair
  if (checkTwinsCard(former)) {
    if (checkTwinsCard(later)) {
      const formerMax = Math.max(former[0].number, former[1].number)
      const laterMax = Math.max(later[0].number, later[1].number)
      if (formerMax === 13) {
        return false
      }
      if (laterMax - formerMax === 1 || laterMax === 13) {
        return true
      }
    }
    if (checkTripletsCard(later) || checkQuadsCard(later) || checkBombCard(later)) {
      return true
    }
    return false
  }

  // If former is triplets
  if (checkTripletsCard(former)) {
    if (checkTripletsCard(later)) {
      const formerVal = former.find((c) => c.number !== 0)?.number || 0
      const laterVal = later.find((c) => c.number !== 0)?.number || 0
      if (formerVal === 13) {
        return false
      }
      if (laterVal - formerVal >= 1) {
        return true
      }
    }
    if (checkQuadsCard(later) || checkBombCard(later)) {
      return true
    }
    return false
  }

  // If former is quads
  if (checkQuadsCard(former)) {
    if (checkQuadsCard(later)) {
      const formerVal = former.find((c) => c.number !== 0)?.number || 0
      const laterVal = later.find((c) => c.number !== 0)?.number || 0
      if (formerVal === 13) {
        return false
      }
      if (laterVal - formerVal >= 1) {
        return true
      }
    }
    if (checkBombCard(later)) {
      return true
    }
    return false
  }

  // If former is bomb
  if (checkBombCard(former)) {
    return false
  }

  return false
}

