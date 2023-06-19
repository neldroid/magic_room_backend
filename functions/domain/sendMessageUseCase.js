const { addLastMessage } = require("../data/roomRepository");
const { decreaseactionTimeAllUserAgainstCards, decreaseactionTimeAllUserCards, isActiveCard } = require("../data/userRepository");

async function sendMessageUseCase(userId, roomId, message) {
    // TODO: Check in the future, now there not cards for this case    
    // Add the last message to the room
    addLastMessage(roomId, message.message)
    // Reduce the 'waiting time' for the cards associated
    decreaseactionTimeAllUserAgainstCards(userId)
    decreaseactionTimeAllUserCards(userId)
}

module.exports = {
    sendMessageUseCase
}