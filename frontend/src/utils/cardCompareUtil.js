// @Description : former_cards(전자가 낸 주패묶음)와 later_cards(후자가 낸 주패묶음)를 비교하여 later_cards가 former_cards를 누를수 있는가 없는가 판정.
// @Case : former_cards와 later_cards 묶음이 Object Array형식으로 들어와야 한다.
// @Title : CardCompareUtil
// @Input : object array, object array
// @Output : 낼수 있다면 : True, 없다면 : False
// @Author : AURORA

import { GuessValidationCheck } from "./guessValidationCheck";

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const THREE = 3;
const FOUR = 4;
const FIVE = 5;

// 한패인가 검사
const checkOneCard = (obj) => {
  if (obj.length === ONE) {
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
const checkTripletsCard = (obj) => {
  if (obj.length === THREE) {
    if (obj[0].number === obj[1].number && obj[1].number === obj[2].number) {
      return true;
    } else if (obj[0].number === obj[1].number && obj[2].number === ZERO) {
      return true;
    } else if (obj[0].number === obj[2].number && obj[1].number === ZERO) {
      return true;
    } else if (obj[1].number === obj[2].number && obj[0].number === ZERO) {
      return true;
    } else if (obj[0].number === ZERO && obj[1].number === ZERO) {
      return true;
    } else if (obj[0].number === ZERO && obj[2].number === ZERO) {
      return true;
    } else if (obj[1].number === ZERO && obj[2].number === ZERO) {
      return true;
    }
  }
  return false;
};

// 마대인가 검사
const checkQuadsCard = (obj) => {
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

const checkTwinStraightCardStatus = (obj) => {
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

// 련속5패-닐리리 검사
const checkStraightCard = (obj) => {
  if (obj.length === FIVE) {
    // 처음에는 수값으로, 다음에는 꽃형타로 정렬
    obj.sort(function (a, b) {
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
const checkTwinStraightCard = (obj) => {
  if (obj.length === FIVE * 2) {
    // 처음에는 수값으로, 다음에는 꽃형타로 정렬
    obj.sort(function (a, b) {
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
            number: obj[k].number,
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
            number: obj[k].number,
          });
        }
        obj2[0].number = i;
        let obj3 = new Array([]);
        for (let j = 1; j < 14; j++) {
          obj3 = [];
          for (let k = 0; k < obj2.length; k++) {
            obj3.push({
              type: obj2[k].type,
              number: obj2[k].number,
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

// 따소-폭탄인가 검사
const checkBombCard = (obj) => {
  if (obj.length === TWO) {
    if (obj[0].number === ZERO && obj[1].number === ZERO) {
      return true;
    }
  }
  return false;
};

export const CardCompareUtil = (param_former_cards, param_later_cards) => {
  const guess_former_cards  = GuessValidationCheck(param_former_cards);
  const guess_later_cards = GuessValidationCheck(param_later_cards);
  let former_cards, later_cards;
  if(guess_former_cards.length > 0) {
    former_cards = [...guess_former_cards];
  } else {
    former_cards = [...param_former_cards];
  }
  if(guess_later_cards.length > 0) {
    later_cards = [...guess_later_cards]
  } else {
    later_cards = [...param_later_cards]  
  }
  var result = false;
  var check_f;
  var check_l;
  // 전자가 한패인 경우
  check_f = checkOneCard(former_cards);
  if (check_f === true) {
    check_l = checkOneCard(later_cards);

    // 후자가 한패인 경우
    if (check_l === true) {
      // 전자가 13 (2)을 냈을때
      if (former_cards[0].number === 13) {
        result = false;
        return result;
      }
      // 후자가 2로 눌렀을떄
      if (later_cards[0].number === 13) {
        result = true;
        return result;
      }
      // +1 큰 한패를 내거나 2로 눌렀을떄
      if (
        later_cards[0].number - former_cards[0].number === 1 ||
        later_cards[0].number === 13
      ) {
        result = true;
        return result;
      }
    }

    // 방으로 눌렀을떄
    check_l = checkTripletsCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }

    // 마대로 눌렀을떄
    check_l = checkQuadsCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }

    // 폭탄으로 눌렀을떄
    check_l = checkBombCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }
    return result;
  } else if (checkTwinsCard(former_cards) === true) {
    // 전자가 같은 두패인 경우
    check_l = checkTwinsCard(later_cards);
    
    // 후자가 두패인 경우
    if (check_l === true) {
      let tmp;
      if(former_cards[0].number > former_cards[1].number){
        tmp = former_cards[0].number;
        former_cards[0].number = former_cards[1].number;
        former_cards[1].number = tmp;
      }
      if(later_cards[0].number > later_cards[1].number){
        tmp = later_cards[0].number;
        later_cards[0].number = later_cards[1].number;
        later_cards[1].number = tmp;
      }
      // 전자가 13 (2-2)을 냈을때
      if (former_cards[1].number === 13 || former_cards[0].number === 13) {
        result = false;
        return result;
      }

      // +1 큰 두패를 내거나 2로 눌렀을떄
      else if (
        later_cards[1].number - former_cards[1].number === 1 ||
        later_cards[1].number === 13
      ) {
        result = true;
        return result;
      }
    }

    // 방으로 눌렀을떄
    check_l = checkTripletsCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }

    // 마대로 눌렀을떄
    check_l = checkQuadsCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }

    // 폭탄으로 눌렀을떄
    check_l = checkBombCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }
    return result;
  } else if (checkTripletsCard(former_cards) === true) {
    // 전자가 같은 세패인 경우

    // 후자가 같은 세패인 경우
    check_l = checkTripletsCard(later_cards);

    if (check_l === true) {
      // 전자가 13 (2-2-2)을 냈을때
      if (former_cards[2].number === 13 || former_cards[1].number === 13 || former_cards[0].number === 13) {
        result = false;
        return result;
      }
      let fv, lv;
      for(let p = 0; p < 3; p ++){
        if(former_cards[p].number){
          fv = former_cards[p].number;
        }
        if(later_cards[p].number){
          lv = later_cards[p].number;
        }
      }
      //더 큰 세패로 눌렀을떄
      if (lv - fv >= 1) {
        result = true;
        return result;
      }
    }

    // 마대로 눌렀을떄
    check_l = checkQuadsCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }

    // 폭탄으로 눌렀을떄
    check_l = checkBombCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }
    return result;
  } else if (checkQuadsCard(former_cards) === true) {
    // 전자가 같은 네패인 경우

    // 후자도 같은 네패인 경우
    check_l = checkQuadsCard(later_cards);

    if (check_l === true) {
      // 전자가 13 (2-2-2-2)을 냈을때
      if (former_cards[3].number === 13) {
        result = false;
        return result;
      }

      //더 큰 네패로 눌렀을떄
      let fv, lv;
      for(let p = 0; p < 4; p ++){
        if(former_cards[p].number){
          fv = former_cards[p].number;
        }
        if(later_cards[p].number){
          lv = later_cards[p].number;
        }
      }
      
      if (lv - fv >= 1) {
        result = true;
        return result;
      }
    }

    // 폭탄으로 눌렀을떄
    check_l = checkBombCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }
    return result;
  } else if (checkBombCard(former_cards) === true) {
    // 전자가 폭탄인 경우
    result = false;
    return result;
  } else if (checkStraightCard(former_cards) === true) {
    /// --- 전자가 련속5패-닐리리인 경우 ---

    // 후자가 련속5패-닐리리인 경우
    check_l = checkStraightCard(later_cards);

    if (check_l === true) {
      // +1 더 큰 닐리리로 눌렀을떄
      if (
        later_cards[0].number - former_cards[0].number === 1 &&
        later_cards[4].number - former_cards[4].number === 1
      ) {
        result = true;
        return result;
      }
    } else if (checkTripletsCard(later_cards)) {
      result = true;
      return result;
    } else if (checkQuadsCard(later_cards)) {
      result = true;
      return result;
    }
    // 폭탄으로 눌렀을떄
    check_l = checkBombCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }
    return result;
  } else if (checkTwinStraightCard(former_cards) === true) {
    // 전자가 쌍련속5패-쌍닐리리인 경우

    // 후자가 쌍련속5패-쌍닐리리인 경우
    check_l = checkTwinStraightCard(later_cards);

    if (check_l === true) {
      // +1 더 큰 닐리리로 눌렀을떄
      if (
        later_cards[0].number - former_cards[0].number === 1 &&
        later_cards[8].number - former_cards[8].number === 1
      ) {
        result = true;
        return result;
      }
    }

    // 폭탄으로 눌렀을떄
    check_l = checkBombCard(later_cards);
    if (check_l === true) {
      result = true;
      return result;
    }
    return result;
  } else {
    result = false;
    return result;
  }
};
