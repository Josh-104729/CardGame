// Card validation utilities - simplified version for gameplay
// Based on the existing frontend implementation

export interface Card {
  type: number // 0: Spade, 1: Heart, 2: Crova, 3: Diamond, 4: SoWang, 5: TaWang
  number: number // 1-13 for regular cards, 0 for special cards (Ta, So)
}

export interface ValidationResult {
  status: number // 0: bad, 1: good, 2: bang, 3: madae, 4: taso
  msg: string
  guess_cards?: any []
}

const ZERO = 0
const ONE = 1
const TWO = 2
const THREE = 3
const FOUR = 4
const FIVE = 5
const BAD_STATUS = 0;
const GOOD_STATUS = 1;
const BANG_STATUS = 2;
const MADAE_STATUS = 3;
const TASO_STATUS = 4;
const ERR_MSG = "주패형식이 정확하지 않습니다. 다시 선택하십시오.";
const REC_NEED_MSG = "아래의 주패묶음을 추천합니다.";
const NO_NEED_MSG = "주패묶음이 정확합니다. 가능한 방안은 한가지입니다.";
const BEST_MSG = "대소왕주패입니다. 제일 강한 묶음입니다.";

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
    } else if (obj[0].number !== obj[1].number && obj[1].number !== ZERO) {
      return true;
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
      return true;
    } else if (obj[0].number === obj[1].number && obj[2].number === ZERO) {
      return true;
    } else if (obj[0].number === obj[2].number && obj[1].number === ZERO) {
      return true;
    } else if (obj[1].number === obj[2].number && obj[0].number === ZERO) {
      return true;
    } else if (
      obj[0].number === obj[1].number &&
      obj[1].number === ZERO &&
      obj[2].number !== ZERO
    ) {
      return true;
    } else if (
      obj[0].number === obj[2].number &&
      obj[2].number === ZERO &&
      obj[1].number !== ZERO
    ) {
      return true;
    } else if (
      obj[1].number === obj[2].number &&
      obj[2].number === ZERO &&
      obj[0].number !== ZERO
    ) {
      return true;
    }
  }
  return false;
}

// Check if quads (마대)
const checkQuadsCard = (obj: Card[]): boolean => {
  if (obj.length === FOUR) {
    if (
      obj[0].number === obj[1].number &&
      obj[1].number === obj[2].number &&
      obj[2].number === obj[3].number
    ) {
      return true;
    } else if (
      obj[0].number === obj[1].number &&
      obj[1].number === obj[2].number &&
      obj[3].number === ZERO
    ) {
      return true;
    } else if (
      obj[0].number === obj[1].number &&
      obj[1].number === obj[3].number &&
      obj[2].number === ZERO
    ) {
      return true;
    } else if (
      obj[0].number === obj[2].number &&
      obj[2].number === obj[3].number &&
      obj[1].number === ZERO
    ) {
      return true;
    } else if (
      obj[1].number === obj[2].number &&
      obj[2].number === obj[3].number &&
      obj[0].number === ZERO
    ) {
      return true;
    }

    if (
      obj[0].number === obj[1].number &&
      obj[2].number === 0 &&
      obj[3].number === 0
    ) {
      return true;
    } else if (
      obj[0].number === obj[2].number &&
      obj[1].number === 0 &&
      obj[3].number === 0
    ) {
      return true;
    } else if (
      obj[0].number === obj[3].number &&
      obj[1].number === 0 &&
      obj[2].number === 0
    ) {
      return true;
    } else if (
      obj[1].number === obj[2].number &&
      obj[0].number === 0 &&
      obj[3].number === 0
    ) {
      return true;
    } else if (
      obj[1].number === obj[3].number &&
      obj[0].number === 0 &&
      obj[2].number === 0
    ) {
      return true;
    } else if (
      obj[2].number === obj[3].number &&
      obj[1].number === 0 &&
      obj[0].number === 0
    ) {
      return true;
    }
  }
  return false;
}

const checkTwinStraightCardStatus = (obj: Card[]): boolean => {
  return (
    obj[1].number - obj[0].number === ZERO &&
    obj[3].number - obj[2].number === ZERO &&
    obj[5].number - obj[4].number === ZERO &&
    obj[7].number - obj[6].number === ZERO &&
    obj[9].number - obj[8].number === ZERO &&
    obj[2].number - obj[0].number === ONE &&
    obj[4].number - obj[2].number === ONE &&
    obj[6].number - obj[4].number === ONE &&
    obj[8].number - obj[6].number === ONE
  );
};

const checkStraightCardStatus = (obj: Card[]): boolean => {
  return (
    obj[1].number - obj[0].number === ONE &&
    obj[2].number - obj[1].number === ONE &&
    obj[3].number - obj[2].number === ONE &&
    obj[4].number - obj[3].number === ONE
  );
};

const checkStraightCard = (obj: Card[]): boolean => {
  if (obj.length === FIVE) {
    obj.sort(function (a, b) {
      return a.number - b.number ? a.number - b.number : a.type - b.type;
    });
    if (
      obj[1].number - obj[0].number === ONE &&
      obj[2].number - obj[1].number === ONE &&
      obj[3].number - obj[2].number === ONE &&
      obj[4].number - obj[3].number === ONE
    ) {
      return true;
    }
    if (
      obj[0].number === ZERO &&
      obj[1].number !== ZERO
    ) {
      let tmp = obj[2].number - obj[1].number;
      if (tmp === ZERO) {
        return false;
      }
      tmp = obj[3].number - obj[2].number;
      if (tmp === ZERO) {
        return false;
      }
      tmp = obj[4].number - obj[3].number;
      if (tmp === ZERO) {
        return false;
      }
      tmp = obj[4].number - obj[1].number;
      if (tmp === FOUR || tmp === THREE) {
        return true;
      }
    }

    if (obj[0].number === ZERO && obj[1].number === ZERO) {
      let tmp = obj[3].number - obj[2].number;
      if (tmp === ZERO) {
        return false;
      }
      tmp = obj[4].number - obj[3].number;
      if (tmp === ZERO) {
        return false;
      }
      tmp = obj[4].number - obj[2].number;

      if (tmp === TWO || tmp === THREE || tmp === FOUR) {
        return true;
      }
    }
  }
  return false;
};

const checkTwinStraightCard = (obj: Card[]): boolean => {
  if (obj.length === FIVE * 2) {
    obj.sort(function (a, b) {
      return a.number - b.number ? a.number - b.number : a.type - b.type;
    });
    if (
      obj[0].number !== ZERO &&
      checkTwinStraightCardStatus(obj)
    ) {
      return true;
    }
    if (
      obj[0].number === ZERO &&
      obj[1].number !== ZERO
    ) {
      let obj2: Card[] = [];
      for (let i = 1; i < 14; i++) {
        obj2 = [];
        for (let k = 0; k < obj.length; k++) {
          obj2.push({
            type: obj[k].type,
            number: obj[k].number
          });
        }
        obj2[0].number = i;
        obj2.sort(function (a, b) {
          return a.number - b.number ? a.number - b.number : a.type - b.type;
        });
        if (checkTwinStraightCardStatus(obj2)) {
          return true;
        }
      }
      return false;
    }
    if (
      obj[0].number === ZERO &&
      obj[1].number === ZERO
    ) {
      let obj2: Card[] = [];
      for (let i = 1; i < 14; i++) {
        obj2 = [];
        for (let k = 0; k < obj.length; k++) {
          obj2.push({
            type: obj[k].type,
            number: obj[k].number
          });
        }
        obj2[0].number = i;
        let obj3: Card[] = [];
        for (let j = 1; j < 14; j++) {
          obj3 = [];
          for (let k = 0; k < obj2.length; k++) {
            obj3.push({
              type: obj2[k].type,
              number: obj2[k].number
            });
          }
          obj3[1].number = j;
          obj3.sort(function (a, b) {
            return a.number - b.number ? a.number - b.number : a.type - b.type;
          });
          if (checkTwinStraightCardStatus(obj3)) {
            return true;
          }
        }
      }
      return false;
    }
  }
  return false;
};

const checkBombCard = (obj: Card[]): boolean => {
  if (obj.length === TWO) {
    if (obj[0].number === ZERO && obj[1].number === ZERO) {
      return true;
    }
  }
  return false;
};

export const guessValidationCheck = (obj: Card[]): any => {
  let result: any = {};
  let guess_cards: Card[][] = [];
  let check_val = false;

  const cards = obj;
  check_val = checkOneCard(cards);
  if (check_val === true) {
    result.status = GOOD_STATUS;
    result.msg = NO_NEED_MSG;
    result.guess_cards = [];
  } else if (checkTwinsCard(cards)) {
    result.status = GOOD_STATUS;
    result.msg = NO_NEED_MSG;
    result.guess_cards = [];
  } else if (checkTripletsCard(cards)) {
    result.status = BANG_STATUS;
    result.msg = NO_NEED_MSG;
    result.guess_cards = [];
  } else if (checkQuadsCard(cards)) {
    result.status = MADAE_STATUS;
    result.msg = NO_NEED_MSG;
    result.guess_cards = [];
  } else if (checkStraightCard(cards)) {
    result.status = GOOD_STATUS;
    cards.sort((a, b) => {
      return a.number - b.number ? a.number - b.number : a.type - b.type;
    });

    if (cards[0].number !== ZERO) {
      result.msg = NO_NEED_MSG;
      result.guess_cards = [];
    } else {
      if (cards[1].number !== ZERO) {
        let card_obj: Card[] = [];
        for (let i = 1; i < 14; i++) {
          card_obj = [];
          for (let k = 0; k < cards.length; k++) {
            card_obj.push({
              type: cards[k].type,
              number: cards[k].number
            });
          }
          card_obj[0].number = i;
          card_obj.sort((a, b) => {
            return a.number - b.number ? a.number - b.number : a.type - b.type;
          });
          if (checkStraightCardStatus(card_obj)) {
            guess_cards.push(card_obj);
          }
        }
        result.msg = guess_cards.length ? REC_NEED_MSG : NO_NEED_MSG;
        guess_cards.sort((a, b) => {
          return b[0].number - a[0].number
            ? b[0].number - a[0].number
            : b[0].type - a[0].type;
        });
        result.guess_cards = guess_cards[0];
      } else {
        let card_obj: Card[] = [];
        for (let i = 1; i < 14; i++) {
          card_obj = [];
          for (let k = 0; k < cards.length; k++) {
            card_obj.push({
              type: cards[k].type,
              number: cards[k].number
            });
          }
          card_obj[0].number = i;
          let card_obj2: Card[] = [];
          for (let j = 1; j < 14; j++) {
            card_obj2 = [];
            for (let k = 0; k < card_obj.length; k++) {
              card_obj2.push({
                type: card_obj[k].type,
                number: card_obj[k].number
              });
            }
            card_obj2[1].number = j;
            card_obj2.sort((a, b) => {
              return a.number - b.number
                ? a.number - b.number
                : a.type - b.type;
            });
            if (checkStraightCardStatus(card_obj2)) {
              guess_cards.push(card_obj2);
            }
          }
        }
        result.msg = guess_cards.length ? REC_NEED_MSG : NO_NEED_MSG;
      }
    }
  } else if (checkTwinStraightCard(cards)) {
    result.status = GOOD_STATUS;
    cards.sort((a, b) => {
      return a.number - b.number ? a.number - b.number : a.type - b.type;
    });

    if (cards[0].number !== ZERO) {
      result.msg = NO_NEED_MSG;
      result.guess_cards = [];
    } else {
      if (cards[1].number !== ZERO) {
        let card_obj: Card[] = [];
        for (let i = 1; i < 14; i++) {
          card_obj = [];
          for (let k = 0; k < cards.length; k++) {
            card_obj.push({
              type: cards[k].type,
              number: cards[k].number
            });
          }
          card_obj[0].number = i;
          card_obj.sort((a, b) => {
            return a.number - b.number ? a.number - b.number : a.type - b.type;
          });
          if (checkTwinStraightCardStatus(card_obj)) {
            guess_cards.push(card_obj);
          }
        }
        result.msg = guess_cards.length ? REC_NEED_MSG : NO_NEED_MSG;
        guess_cards.sort((a, b) => {
          return b[0].number - a[0].number
            ? b[0].number - a[0].number
            : b[0].type - a[0].type;
        });
        result.guess_cards = guess_cards[0];
      } else {
        let card_obj: Card[] = [];
        for (let i = 1; i < 14; i++) {
          card_obj = [];
          for (let k = 0; k < cards.length; k++) {
            card_obj.push({
              type: cards[k].type,
              number: cards[k].number
            });
          }
          card_obj[0].number = i;
          let card_obj2: Card[] = [];
          for (let j = 1; j < 14; j++) {
            card_obj2 = [];
            for (let k = 0; k < card_obj.length; k++) {
              card_obj2.push({
                type: card_obj[k].type,
                number: card_obj[k].number
              });
            }
            card_obj2[1].number = j;
            card_obj2.sort((a, b) => {
              return a.number - b.number
                ? a.number - b.number
                : a.type - b.type;
            });
            if (checkTwinStraightCardStatus(card_obj2)) {
              guess_cards.push(card_obj2);
            }
          }
        }
        result.msg = guess_cards.length ? REC_NEED_MSG : NO_NEED_MSG;
        guess_cards.sort((a, b) => {
          return b[0].number - a[0].number
            ? b[0].number - a[0].number
            : b[0].type - a[0].type;
        });
        result.guess_cards = guess_cards[0];
      }
    }
  } else if (checkBombCard(cards)) {
    result.status = TASO_STATUS;
    result.msg = BEST_MSG;
    guess_cards.push([{ type: 4, number: 0 }, { type: 5, number: 0 }]);
    result.guess_cards = guess_cards[0];
  } else {
    result.status = BAD_STATUS;
    result.msg = ERR_MSG;
    result.guess_cards = guess_cards;
  }
  return result;
};
