// Card validation utilities - simplified version for gameplay
// Based on the existing frontend implementation

export interface Card {
  type: number // 0: Spade, 1: Heart, 2: Crova, 3: Diamond, 4: SoWang, 5: TaWang
  number: number // 1-13 for regular cards, 0 for special cards (Ta, So)
}

export interface ValidationResult {
  status: number // 0: bad, 1: good, 2: bang, 3: madae, 4: taso
  msg: string
  guess_cards?: Card[][]
}

const ZERO = 0
const ONE = 1
const TWO = 2
const THREE = 3
const FOUR = 4

// Check if single card
const checkOneCard = (obj: Card[]): boolean => {
  return obj.length === ONE && obj[0].number !== 0
}

// Check if pair (twins)
const checkTwinsCard = (obj: Card[]): boolean => {
  if (obj.length === TWO) {
    if (obj[0].number === ZERO && obj[1].number === ZERO) return false
    if (obj[0].number === obj[1].number && obj[0].number !== ZERO) {
      return true
    } else if (obj[0].number !== obj[1].number) {
      if (obj[0].number === ZERO || obj[1].number === ZERO) return true
    }
  }
  return false
}

// Check if triplets (방)
const checkTripletsCard = (obj: Card[]): boolean => {
  if (obj.length === THREE) {
    if (obj[0].number === obj[1].number && obj[1].number === obj[2].number) {
      return true
    } else if (obj[0].number === obj[1].number && obj[2].number === ZERO) {
      return true
    } else if (obj[0].number === obj[2].number && obj[1].number === ZERO) {
      return true
    } else if (obj[1].number === obj[2].number && obj[0].number === ZERO) {
      return true
    }
  }
  return false
}

// Check if quads (마대)
const checkQuadsCard = (obj: Card[]): boolean => {
  if (obj.length === FOUR) {
    if (
      obj[0].number === obj[1].number &&
      obj[1].number === obj[2].number &&
      obj[2].number === obj[3].number
    ) {
      return true
    } else if (
      obj[0].number === obj[1].number &&
      obj[1].number === obj[2].number &&
      obj[3].number === ZERO
    ) {
      return true
    } else if (
      obj[0].number === obj[1].number &&
      obj[1].number === obj[3].number &&
      obj[2].number === ZERO
    ) {
      return true
    } else if (
      obj[0].number === obj[2].number &&
      obj[2].number === obj[3].number &&
      obj[1].number === ZERO
    ) {
      return true
    } else if (
      obj[1].number === obj[2].number &&
      obj[2].number === obj[3].number &&
      obj[0].number === ZERO
    ) {
      return true
    }
  }
  return false
}

// Check if bomb (폭탄 - TaSo)
const checkBombCard = (obj: Card[]): boolean => {
  if (obj.length === TWO) {
    if (obj[0].number === ZERO && obj[1].number === ZERO) {
      return true
    }
  }
  return false
}

export const guessValidationCheck = (cards: Card[]): ValidationResult => {
  const result: ValidationResult = {
    status: 0,
    msg: '주패형식이 정확하지 않습니다. 다시 선택하십시오.',
  }

  if (checkOneCard(cards)) {
    result.status = 1
    result.msg = '주패묶음이 정확합니다.'
  } else if (checkTwinsCard(cards)) {
    result.status = 1
    result.msg = '주패묶음이 정확합니다.'
  } else if (checkTripletsCard(cards)) {
    result.status = 2 // Bang
    result.msg = '주패묶음이 정확합니다.'
  } else if (checkQuadsCard(cards)) {
    result.status = 3 // Madae
    result.msg = '주패묶음이 정확합니다.'
  } else if (checkBombCard(cards)) {
    result.status = 4 // Taso
    result.msg = '대소왕주패입니다. 제일 강한 묶음입니다.'
  }

  return result
}

