const initialState = {
    choosedCard:[]
}

const cardReduer = (state = initialState, action) => {
    switch (action.type) {
        case "PUSH_CARD":
            return{
                ...state,
                choosedCard:[...state.choosedCard,{
                    type:action.cardType,
                    number:action.cardNumber
                }]
            }

        case "POP_CARD":
            return {
                ...state,
                choosedCard: state.choosedCard.filter(card => card.type !== action.cardType || card.number !== action.cardNumber)
            }
            
        case "EMPTY_CARD":
            return {
                ...state,
                choosedCard: []
            }
        default:
            return state;
    }
}

export default cardReduer;