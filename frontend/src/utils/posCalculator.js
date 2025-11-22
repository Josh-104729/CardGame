// @Description : 화면해상도와 인원수를 입력받아 매 사람들의 위치와 주패를 내는 위치를 돌려주는 함수
// @Case : 화면해상도와 전체 인원수를 Array로 입구받아야 한다.
// @Title : PosCalculator
// @Input : array
// @Output : 'userPos'objectArray와 'droppingCardsPos'objectArray를 출구한다.
// @Author : JASON

export const PosCalculator = (cnt, droppingCards, display) => {
  const pCnt = cnt;
  const screen = {
    x: display[0],
    y: display[1],
  };

  let dropCnt = new Array([]);

  droppingCards.map((item, index) => 
    dropCnt[index] = item.length,
  )

  let userPos = new Array([]);
  for (let i = 0; i < pCnt; i++)
    userPos[i] = { x: 0, y: 0 }

  let dropPos = new Array([]);
  for (let i = 0; i < pCnt; i++)
    dropPos[i] = { x: 0, y: 0 }

  switch (pCnt) {
    case 1:
      userPos[0] = { x: screen.x / 54 * 12, y: screen.y / 37 * 25 }
      return { userPos, dropPos };

    case 2:
      userPos[0] = { x: screen.x / 54 * 12, y: screen.y / 37 * 25 }
      userPos[1] = { x: screen.x / 54 * 45, y: screen.y / 37 * 5 }
      return { userPos, dropPos };

    case 3:
      userPos[0] = { x: screen.x / 54 * 12, y: screen.y / 37 * 25 }
      userPos[1] = { x: screen.x / 54 * 45, y: screen.y / 37 * 5 }
      userPos[2] = { x: screen.x / 54 * 3, y: screen.y / 37 * 5 }

      dropPos[0] = { x: screen.x / 54 * 26, y: screen.y / 37 * 20 }
      dropPos[1] = { x: screen.x / 54 * 38 - dropCnt[1] * 15, y: screen.y / 37 * 6 }
      dropPos[2] = { x: screen.x / 54 * 10, y: screen.y / 37 * 6 }
      return { userPos, dropPos };

    case 4:
      userPos[0] = { x: screen.x / 54 * 3, y: screen.y / 37 * 25 }
      userPos[1] = { x: screen.x / 54 * 45, y: screen.y / 37 * 25 }
      userPos[2] = { x: screen.x / 54 * 45, y: screen.y / 37 * 5 }
      userPos[3] = { x: screen.x / 54 * 3, y: screen.y / 37 * 5 }

      dropPos[0] = { x: screen.x / 54 * 10, y: screen.y / 37 * 20 }
      dropPos[1] = { x: screen.x / 54 * 38 - dropCnt[1] * 15, y: screen.y / 37 * 20 }
      dropPos[2] = { x: screen.x / 54 * 38 - dropCnt[2] * 15, y: screen.y / 37 * 6 }
      dropPos[3] = { x: screen.x / 54 * 10, y: screen.y / 37 * 6 }
      return { userPos, dropPos };
    case 5:

      userPos[0] = { x: screen.x / 54 * 11, y: screen.y / 37 * 25 }
      userPos[1] = { x: screen.x / 54 * 45, y: screen.y / 37 * 16 }
      userPos[2] = { x: screen.x / 54 * 45, y: screen.y / 37 * 3 }
      userPos[3] = { x: screen.x / 54 * 3, y: screen.y / 37 * 3 }
      userPos[4] = { x: screen.x / 54 * 3, y: screen.y / 37 * 16 }

      dropPos[0] = { x: screen.x / 54 * 26, y: screen.y / 37 * 20 }
      dropPos[1] = { x: screen.x / 54 * 38 - dropCnt[1] * 15, y: screen.y / 37 * 17 }
      dropPos[2] = { x: screen.x / 54 * 38 - dropCnt[2] * 15, y: screen.y / 37 * 6 }
      dropPos[3] = { x: screen.x / 54 * 10, y: screen.y / 37 * 6 }
      dropPos[4] = { x: screen.x / 54 * 10, y: screen.y / 37 * 17 }
      return { userPos, dropPos };

    default:
      break;
  }
};
