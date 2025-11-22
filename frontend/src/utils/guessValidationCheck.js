// @Description : 일정한 주패배렬이 들어오면 우선 주패배렬이 오락규칙에 맞는가 판정하는 Validation 검사를 진행한다.
//                RULE과 어긋나는 경우 경고통보를 현시한다.
//                RULE에 맞는 경우에 Ta 혹은 So가 섞인것으로 하여 발생하는 모호한 경우들에 대처하기 위하여 해당 주패배렬의 무게값의 가능한 경우들을 모두 출력하여 선수가 여러개의 선택안에서 한가지를 정확히 골라 내도록 하여 다른 선수들이 그 무게값을 정확히 Guessing하도록 해주는 함수이다.
// @Case : ... Object array가 들어온다
// Object-type: 0, 1, 2, 3, 4, 5 (0 : Spade, 1 : Heart, 2 : Crova, 3 : Diamond, 4 : SoWang, 5 : TaWang)
// Object-num : 1 - 13, 0, 0 (1 : 3, 2 : 4, ... 12 : A, 13 : 2, 0 : Ta, So)
// @Title : GuessValidationCheck
// @Input : Object Array
// @Output 1:
// [
//   status: 1,
//   msg: '아래의 묶음들중에서 내려는 주패묶음을 정확히 선택하십시오.',
//   guess_cards: [
//     [
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object]
//     ],
//     [
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object]
//     ]
//   ]
// ]
// @Output 2:
// [
//   status: 0,
//   msg: '주패형식이 정확하지 않습니다. 다시 선택하십시오.',
//   guess_cards: [
//   ]
// ]
// @Author : AURORA

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const THREE = 3;
const FOUR = 4;
const FIVE = 5;
const BAD_STATUS = 0;
const GOOD_STATUS = 1;
const BANG_STATUS = 2;
const MADAE_STATUS = 3;
const TASO_STATUS = 4;
const ERR_MSG = "주패형식이 정확하지 않습니다. 다시 선택하십시오.";
const REC_NEED_MSG = "아래의 주패묶음을 추천합니다.";
const NO_NEED_MSG = "주패묶음이 정확합니다. 가능한 방안은 한가지입니다.";
const BEST_MSG = "대소왕주패입니다. 제일 강한 묶음입니다.";

// 한패인가 검사
const checkOneCard = obj => {
  if (obj.length === ONE && obj[0].number !== 0) {
    return true;
  } else return false;
};

// 같은 두패인가 검사
const checkTwinsCard = obj => {
  if (obj.length === TWO) {
    if (obj[0].number === ZERO && obj[1].number === ZERO) return false;
    if (obj[0].number === obj[1].number && obj[0].number !== ZERO) {
      return true;
    } else if (obj[0].number === obj[1].number && obj[1].number !== ZERO){
      return true;
    } else if (obj[0].number !== obj[1].number) {
      if (obj[0].number === ZERO || obj[1].number === ZERO) return true;
    }
  }
  return false;
};

// 방인가 검사
const checkTripletsCard = obj => {
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
};

// 마대인가 검사
const checkQuadsCard = obj => {
  if (obj.length === FOUR) {
    //같은 4패 혹은 같은 3패와 따 혹은 소
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

    //같은 2패와 따소
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
};

const checkTwinStraightCardStatus = obj => {
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

const checkStraightCardStatus = obj => {
  return (
    obj[1].number - obj[0].number === ONE &&
    obj[2].number - obj[1].number === ONE &&
    obj[3].number - obj[2].number === ONE &&
    obj[4].number - obj[3].number === ONE
  );
};

// 련속5패-닐리리 검사
const checkStraightCard = obj => {
  if (obj.length === FIVE) {
    // 처음에는 수값으로, 다음에는 꽃형타로 정렬
    obj.sort(function(a, b) {
      return a.number - b.number ? a.number - b.number : a.type - b.type;
    });
    if (
      // 따-쏘가 하나도 존재하지 않을때
      obj[1].number - obj[0].number === ONE &&
      obj[2].number - obj[1].number === ONE &&
      obj[3].number - obj[2].number === ONE &&
      obj[4].number - obj[3].number === ONE
    ) {
      return true;
    }
    if (
      // 따-소 중에서 하나만 존재할때
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

    // 따소 둘다 있을때
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

// 쌍련속5패-쌍닐리리 검사
const checkTwinStraightCard = obj => {
  if (obj.length === FIVE * 2) {
    // 처음에는 수값으로, 다음에는 꽃형타로 정렬
    obj.sort(function(a, b) {
      return a.number - b.number ? a.number - b.number : a.type - b.type;
    });
    if (
      // 따-쏘가 하나도 존재하지 않을떄
      obj[0].number !== ZERO &&
      checkTwinStraightCardStatus(obj)
    ) {
      return true;
    }
    if (
      // 따-소 중에서 하나만 존재할때
      obj[0].number === ZERO &&
      obj[1].number !== ZERO
    ) {
      let obj2 = new Array([]);
      for (let i = 1; i < 14; i++) {
        obj2 = [];
        for (let k = 0; k < obj.length; k++) {
          obj2.push({
            type: obj[k].type,
            number: obj[k].number
          });
        }
        obj2[0].number = i;
        obj2.sort(function(a, b) {
          return a.number - b.number ? a.number - b.number : a.type - b.type;
        });
        if (checkTwinStraightCardStatus(obj2)) {
          return true;
        }
      }
      return false;
    }
    if (
      // 따-소 둘다 존재할떄
      obj[0].number === ZERO &&
      obj[1].number === ZERO
    ) {
      let obj2 = new Array([]);
      for (let i = 1; i < 14; i++) {
        obj2 = [];
        for (let k = 0; k < obj.length; k++) {
          obj2.push({
            type: obj[k].type,
            number: obj[k].number
          });
        }
        obj2[0].number = i;
        let obj3 = new Array([]);
        for (let j = 1; j < 14; j++) {
          obj3 = [];
          for (let k = 0; k < obj2.length; k++) {
            obj3.push({
              type: obj2[k].type,
              number: obj2[k].number
            });
          }
          obj3[1].number = j;
          obj3.sort(function(a, b) {
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

// 따소-폭탄인가 검사
const checkBombCard = obj => {
  if (obj.length === TWO) {
    if (obj[0].number === ZERO && obj[1].number === ZERO) {
      return true;
    }
  }
  return false;
};

export const GuessValidationCheck = obj => {
  let result = new Array([]);
  let guess_cards = new Array([]);
  let check_val = false;
  // Validation 검사
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
        // 따소중 하나만 있을때 가능한 배렬 탐색
        let card_obj = new Array([]);
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
        // 따소 둘다 있을때 가능한 배렬 탐색
        let card_obj = new Array([]);
        for (let i = 1; i < 14; i++) {
          card_obj = [];
          for (let k = 0; k < cards.length; k++) {
            card_obj.push({
              type: cards[k].type,
              number: cards[k].number
            });
          }
          card_obj[0].number = i;
          let card_obj2 = new Array([]);
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
        // 따소중 하나만 있을때 가능한 배렬 탐색
        let card_obj = new Array([]);
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
        // 따-소 둘다 존재할떄 가능한 배렬 탐색
        let card_obj = new Array([]);
        for (let i = 1; i < 14; i++) {
          card_obj = [];
          for (let k = 0; k < cards.length; k++) {
            card_obj.push({
              type: cards[k].type,
              number: cards[k].number
            });
          }
          card_obj[0].number = i;
          let card_obj2 = new Array([]);
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
    guess_cards.push({ type: 4, number: 0 });
    guess_cards.push({ type: 5, number: 0 });
    // guess_cards.sort((a, b) => {
    //   return b[0].number - a[0].number
    //     ? b[0].number - a[0].number
    //     : b[0].type - a[0].type;
    // });
    result.guess_cards = guess_cards;
  } else {
    result.status = BAD_STATUS;
    result.msg = ERR_MSG;
    // guess_cards.sort((a, b) => {
    //   return b[0].number - a[0].number
    //     ? b[0].number - a[0].number
    //     : b[0].type - a[0].type;
    // });
    result.guess_cards = guess_cards;
  }
  return result;
};
