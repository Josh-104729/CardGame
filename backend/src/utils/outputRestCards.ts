import { Card } from "../types/card";

/**
 * @Description : 두개의 주패배렬 즉 손에 집은 주패와 내려는 주패배렬이 들어오면 최종 손에 남는 주패배렬을 출력하는 함수.
 *                만일 손에 없는 배렬이 들어오면 오유없이 원래 주패렬을 출력하기만 하면 된다.
 * @Case : ... Object array가 들어온다
 * Object-type: 0, 1, 2, 3, 4, 5 (0 : Spade, 1 : Heart, 2 : Crova, 3 : Diamond, 4 : SoWang, 5 : TaWang)
 * Object-num : 1 - 13, 0, 0 (1 : 3, 2 : 4, ... 12 : A, 13 : 2, 0 : Ta, So)
 * @Title : OutputRestCards
 * @Input : Object Array 2개
 * @Output : Object Array 1개
 * @Author : AURORA
 */
const sortCards = (obj: Card[]): void => {
  obj.sort((a, b) => {
    return a.number - b.number ? a.number - b.number : a.type - b.type;
  });
};

export const OutputRestCards = (
  card_arr: Card[],
  pop_card_arr: Card[]
): Card[] => {
  sortCards(pop_card_arr);
  const origin_arr: Card[] = [];
  for (let i = 0; i < card_arr.length; i++) {
    origin_arr.push({
      type: card_arr[i].type,
      number: card_arr[i].number,
    });
  }
  const origin_cnt = card_arr.length;
  const pop_cnt = pop_card_arr.length;
  const res_cnt = origin_cnt - pop_cnt;
  
  for (let i = pop_card_arr.length - 1; i >= 0; i--) {
    for (let j = card_arr.length - 1; j >= 0; j--) {
      if (
        card_arr[j].type === pop_card_arr[i].type &&
        card_arr[j].number === pop_card_arr[i].number
      ) {
        card_arr.splice(j, 1);
      } else continue;
    }
  }
  
  if (res_cnt === card_arr.length) return card_arr;
  return origin_arr;
};

