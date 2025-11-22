// @Description : start와 end를 파라메터로 받아 ST-ED구간의 주패들을 출력하는데 여러장인 경우 (start와 end가 다른 경우) Object배렬로, 주패가 한장인 경우 (start와 end가 같은 경우) 한개 Object로 출력하는 함수.
// @Case : 이미전에 우연적으로 배렬된 일정한 순서의 주패배렬이 존재하여야 한다.
// @Title : OutputSectionCards
// @Input : st(int), ed(int)
// @Output : Object Array or Object Element
// @Author : AURORA

let st = 5; // 실례로 시작 : 5
let ed = 9; // 실례로 마감 : 9
const card_bag = [
  { type: 3, number: 6 },
  { type: 3, number: 1 },
  { type: 1, number: 4 },
  { type: 1, number: 11 },
  { type: 0, number: 7 },
  { type: 1, number: 13 },
  { type: 0, number: 10 },
  { type: 3, number: 8 },
  { type: 2, number: 2 },
  { type: 3, number: 12 },
  { type: 0, number: 8 },
  { type: 1, number: 2 },
  { type: 0, number: 4 },
  { type: 1, number: 6 },
  { type: 3, number: 10 },
  { type: 0, number: 11 },
  { type: 3, number: 5 },
  { type: 0, number: 2 },
  { type: 2, number: 8 },
  { type: 2, number: 13 },
  { type: 2, number: 5 },
  { type: 3, number: 11 },
  { type: 2, number: 3 },
  { type: 0, number: 12 },
  { type: 3, number: 13 },
  { type: 2, number: 4 },
  { type: 1, number: 5 },
  { type: 2, number: 6 },
  { type: 0, number: 5 },
  { type: 1, number: 3 },
  { type: 0, number: 9 },
  { type: 4, number: 0 },
  { type: 2, number: 12 },
  { type: 2, number: 1 },
  { type: 1, number: 12 },
  { type: 3, number: 3 },
  { type: 3, number: 2 },
  { type: 1, number: 7 },
  { type: 2, number: 7 },
  { type: 3, number: 4 },
  { type: 0, number: 13 },
  { type: 1, number: 8 },
  { type: 0, number: 1 },
  { type: 0, number: 6 },
  { type: 1, number: 9 },
  { type: 1, number: 1 },
  { type: 5, number: 0 },
  { type: 3, number: 9 },
  { type: 3, number: 7 },
  { type: 2, number: 9 },
  { type: 1, number: 10 },
  { type: 2, number: 11 },
  { type: 2, number: 10 },
  { type: 0, number: 3 },
];

OutputSectionCards = (st, ed) => {
  let cards_onhand = new Array();
  let card_onhand;

  if (st !== ed) {
    for (let i = st; i < ed + 1; i++) {
      cards_onhand.push(card_bag[i]);
    }
    return cards_onhand;
  } else {
    card_onhand = card_bag[st];
    return cards_onhand;
  }
};
