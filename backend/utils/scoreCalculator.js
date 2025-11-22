// @Description : 경기가 끝난후 매 사람이 가지고 있는 주패배렬을 받아가지고 해당 점수를 출력하는 함수.
//                만일 따, 쏘가 있는 사람의 점수는 2배로 계산된다.
// @Case : ... 2차원 Object array가 들어온다
// Object-type: 0, 1, 2, 3, 4, 5 (0 : Spade, 1 : Heart, 2 : Crova, 3 : Diamond, 4 : SoWang, 5 : TaWang)
// Object-num : 1 - 13, 0, 0 (1 : 3, 2 : 4, ... 12 : A, 13 : 2, 0 : Ta, So)
// @Title : ScoreCalculator
// @Input : 2차원 Object Array 5개
// @Output : Array 1개
// @Author : Jason

const { FEE_PERCENT } = require("../const/variables");

const checkSpecialCard = (card_arr) => {
  let double = { status: 0, value: 1 };
  if (card_arr.length === 1) {
    double.status = 0;
    if (card_arr[0].type === 4 || card_arr[0].type === 5) {
      double.value = 2;
    }
    return double;
  }
  else {
    double.status = 1;
    card_arr.map((item) => {
      if (item.type === 4) double.value *= 2;
      if (item.type === 5) double.value *= 2;
    })
    return double;
  }
}

const ScoreCalculator = (bonus, having_card_arr, user_arr) => {
  console.log("utils", bonus, having_card_arr)
  let mark_arr = new Array();
  let total = 0;
  having_card_arr.map((item, index) => {
    const double = checkSpecialCard(item)
    console.log("double", double)
    if (double.status === 0 || double.value === 1)
      mark_arr[index] = -item.length * bonus * double.value;
    else
      mark_arr[index] = -(item.length - (double.value / 2)) * bonus * double.value;
    if (user_arr[index].bounty + mark_arr[index] < 0) {
      mark_arr[index] = -user_arr[index].bounty
    }
    total -= mark_arr[index];
  })
  const index = mark_arr.findIndex(item => item === 0);
  if (index > -1) {
    mark_arr[index] = total * (100 - FEE_PERCENT) / 100;
  }
  return mark_arr;
};

module.exports = { ScoreCalculator };
// const bonus = 100;
// let pop_card_arr = [
//   [
//     { type: 2, number: 4 },
//     { type: 1, number: 6 },
//     { type: 3, number: 4 },
//   ],
//   [
//     { type: 2, number: 4 },
//     { type: 1, number: 6 },
//     { type: 3, number: 4 },
//     { type: 4, number: 6 },
//     { type: 5, number: 4 },
//   ],
//   [
//     { type: 5, number: 6 },
//   ],
//   [
//     { type: 2, number: 4 },
//     { type: 1, number: 6 },
//     { type: 3, number: 4 },
//   ],
//   []
// ];

// let user_arr=[
//   {bounty:1000},
//   {bounty:1000},
//   {bounty:1000},
//   {bounty:1000},
//   {bounty:1000},
// ]

// console.log(ScoreCalculator(bonus, pop_card_arr, user_arr));