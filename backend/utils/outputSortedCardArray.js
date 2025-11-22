// @Description : array와 item받아서 수자별로 1차정렬, 꽃별로 2차정렬된 새 배렬 출력하는 함수
// @Case : ...
// Object-type: 0, 1, 2, 3, 4, 5 (0 : Spade, 1 : Heart, 2 : Crova, 3 : Diamond, 4 : SoWang, 5 : TaWang)
// Object-num : 1 - 13, 0, 0 (1 : 3, 2 : 4, ... 12 : A, 13 : 2, 0 : Ta, So)
// @Title : OutputSortedCardArray
// @Input : ---
// @Output : Object Array
// @Author : AURORA
//

const card_arr = [
  { type: 3, number: 4 },
  { type: 3, number: 5 },
  { type: 1, number: 6 },
  { type: 2, number: 7 },
  { type: 5, number: 0 },
  { type: 1, number: 7 },
  { type: 3, number: 6 },
  { type: 0, number: 5 },
  { type: 2, number: 4 },
  { type: 4, number: 0 },
];

const OutputSortedCardArray = (obj) => {
  obj.sort((a, b) => {
    return a.number - b.number ? a.number - b.number : a.type - b.type;
  });
  return obj;
};

module.exports = { OutputSortedCardArray };

