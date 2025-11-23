import { Card, CardPackResult } from "../types/card";

/**
 * @Description : 54장의 주패들을 우연순서로 배렬하여 Object형으로 출력하는 함수
 * @Case : ...
 * Object-type: 0, 1, 2, 3, 4, 5 (0 : Spade, 1 : Heart, 2 : Crova, 3 : Diamond, 4 : SoWang, 5 : TaWang)
 * Object-num : 1 - 13, 0, 0 (1 : 3, 2 : 4, ... 12 : A, 13 : 2, 0 : Ta, So)
 * @Title : RandomCardsGenerator
 * @Input : ---
 * @Output : Object Array
 * @Author : AURORA
 */
export const RandomCardsGenerator = (
  members: number,
  initialCnt: number,
  total: number
): CardPackResult => {
  const randomKey = 20010103;
  const randomArea = 54;
  const players: Card[][] = [];
  const rest_cards: Card[] = [];

  const card_pack: Card[] = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 14; j++) {
      card_pack.push({
        type: i,
        number: j,
      });
    }
  }

  // 따,소 추가
  card_pack.push(
    {
      type: 4,
      number: 0,
    },
    {
      type: 5,
      number: 0,
    }
  );

  const ran_card_pack: Card[] = [];
  const hash_arr: number[] = [];
  for (let i = 0; i < total + 1; i++) hash_arr.push(0);

  let cnt = 0;

  for (let i = 0; cnt < total; i++) {
    const tmp = Math.floor(Math.random() * randomKey) % randomArea;
    if (!hash_arr[tmp]) {
      ran_card_pack.push(card_pack[tmp]);
      cnt++;
      hash_arr[tmp] = 1;
    } else continue;
  }
  
  let tmp_arr: Card[] = [];
  for (let i = 0; i < members; i++) {
    tmp_arr = [];
    for (let j = 0; j < initialCnt; j++) {
      tmp_arr.push(ran_card_pack[i * initialCnt + j]);
    }
    players.push(tmp_arr);
  }
  
  for (let i = members * initialCnt; i < total; i++) {
    rest_cards.push(ran_card_pack[i]);
  }
  
  for (let i = 0; i < members; i++) {
    players[i].sort((a, b) => 
      a.number - b.number ? a.number - b.number : a.type - b.type
    );
  }
  
  return { players, rest_cards };
};

