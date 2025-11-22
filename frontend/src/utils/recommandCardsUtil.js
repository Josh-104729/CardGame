// @Description : 전 사람이 낸 패와 자기가 가지고있는 패를 받아 낼 패를 추천하는 함수
// @Case : 전 사람이 낸 패와 자기가 가지고있는 패들을 배렬로 받아들인다.
// @Title : RecommandCardsUtil
// @Input : object array, object array
// @Output : object array
// @Author : JASON

import { CardCompareUtil } from "./cardCompareUtil";

const findPossibleCards = (havingCards, possibleCard) => {
  for (let i = 0; i < havingCards.length; i++) {
    if (i === 0)
      possibleCard.push(havingCards[i]);
    else {
      if (havingCards[i] !== havingCards[i - 1])
        possibleCard.push(havingCards[i]);
    }
  }
  for (let i = 0; i < havingCards.length; i++) {
    let temp = new Array;
    if (havingCards[i] === havingCards[i+1]) {
      temp.push(havingCards[i]);
      temp.push(havingCards[i+1]);
      possibleCard.push(temp);
      i += 1;
    }
    temp.push(havingCards[i]);
    for (let j = i + 1; j < bavingCards.length; j++) {
      if (havingCards[i] === havingCards[j]) {
        temp.push(havingCards[j]);
        possibleCard.push(temp);
        i += 1;
      }
    }
  }
  for(let i = 0; i)
}

export const RecommandCardsUtil = (elem1, elem2, cnt) => {
  const previousCard = elem1;
  const havingCards = elem2;
  let recommandCard = new Array;
  let possibleCard = new Array;

  if (cnt === 0) {
    findPossibleCards(havingCards, possibleCard);
  }

  switch (previousCard.length) {
    case 1:
      possibleCard.push(checkOneCard(havingCards));
      possibleCard.push(checkTripleCard(havingCards));
      possibleCard.push(checkQuadCard(havingCards));

      break;
    case 2:
      possibleCard.push(checkTwinCard(previousCard, havingCards));
      possibleCard.
        break;
    case 3:

      break;
    case 4:

      break;
    case 5:

      break;
    default:
      break;
  }

  havingCards.map((item, index) => {
    if (CardCompareUtil(previousCard, item)) {
      recommandCard.push(item);
    }
  })
};
