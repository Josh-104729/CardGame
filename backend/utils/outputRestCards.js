// @Description : 두개의 주패배렬 즉 손에 집은 주패와 내려는 주패배렬이 들어오면 최종 손에 남는 주패배렬을 출력하는 함수.
//                만일 손에 없는 배렬이 들어오면 오유없이 원래 주패렬을 출력하기만 하면 된다.
// @Case : ... Object array가 들어온다
// Object-type: 0, 1, 2, 3, 4, 5 (0 : Spade, 1 : Heart, 2 : Crova, 3 : Diamond, 4 : SoWang, 5 : TaWang)
// Object-num : 1 - 13, 0, 0 (1 : 3, 2 : 4, ... 12 : A, 13 : 2, 0 : Ta, So)
// @Title : OutputRestCards
// @Input : Object Array 2개
// @Output : Object Array 1개
// @Author : AURORA

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const THREE = 3;
const FOUR = 4;
const FIVE = 5;
const BAD_STATUS = 0;
const GOOD_STATUS = 1;
const ERR_MSG = "주패형식이 정확하지 않습니다. 다시 선택하십시오.";
const REC_NEED_MSG =
  "아래의 묶음들중에서 내려는 주패묶음을 정확히 선택하십시오.";
const NO_NEED_MSG = "주패묶음이 정확합니다. 가능한 방안은 한가지입니다.";

let card_arr = [
  { type: 4, number: 0 },
  { type: 5, number: 0 },
  { type: 2, number: 4 },
  { type: 3, number: 4 },
  { type: 0, number: 5 },
  { type: 3, number: 5 },
  { type: 1, number: 6 },
  { type: 3, number: 6 },
  { type: 1, number: 7 },
  { type: 2, number: 7 },
];

let pop_card_arr = [
  { type: 2, number: 4 },
  { type: 1, number: 6 },
  { type: 3, number: 4 },
];

const sortCards = (obj) => {
  obj.sort((a, b) => {
    return a.number - b.number ? a.number - b.number : a.type - b.type;
  });
};

const OutputRestCards = (card_arr, pop_card_arr) => {
  sortCards(pop_card_arr);
  let origin_arr = new Array();
  for (let i = 0; i < card_arr.length; i++) {
    origin_arr.push({
      type: card_arr[i].type,
      number: card_arr[i].number,
    });
  }
  let origin_cnt = card_arr.length;
  let pop_cnt = pop_card_arr.length;
  let res_cnt = origin_cnt - pop_cnt;
  for (let i = pop_card_arr.length - 1; i >= 0; i--) {
    for (let j = card_arr.length - 1; j >= 0; j--) {
      if (
        card_arr[j].type === pop_card_arr[i].type &&
        card_arr[j].number === pop_card_arr[i].number
      ) {
        card_arr.splice(j, ONE);
      } else continue;
    }
  }
  if (res_cnt === card_arr.length) return card_arr;
  return origin_arr;
};

module.exports = { OutputRestCards };