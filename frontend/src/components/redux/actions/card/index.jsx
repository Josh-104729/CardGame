export const handlePushCard = (cardType, cardNumber) => {
    return({
        type: "PUSH_CARD",
        cardType,
        cardNumber,
    })
}

export const handlePopCard = (cardType, cardNumber) => {
    return({
        type: "POP_CARD",
        cardType,
        cardNumber,
    })
}

export const handleEmptyCard = () => {
    return ({
        type: "EMPTY_CARD"
    })
}
