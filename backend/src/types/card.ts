export interface Card {
  type: number; // 0: Spade, 1: Heart, 2: Crova, 3: Diamond, 4: SoWang, 5: TaWang
  number: number; // 1-13 for regular cards, 0 for special cards (Ta, So)
}

export interface CardPackResult {
  players: Card[][];
  rest_cards: Card[];
}

