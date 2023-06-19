const { CardIds, getCardType, CardType} = require('../model/card.js');
const { activateCard, userChangeTextSize, isActiveCard, changeLifeStatus, userChangeIsHightlight, userChangeCharacters, activateAgainstCard, userChangeFont, reduceCard } = require('../data/userRepository.js');
const { removeMessage, createDecoyMessage } = require('../data/messageRepository.js');
const { removeUserFromRoom } = require('../data/roomRepository.js');
const { LifeStatus } = require('../model/user.js');
const { getMessageAffectedId, getRoomAffectedId, getUserAffectedId, getMessageBody, getMessageNickname } = require('../model/params.js');

/* The function handle the activation of one card.
cardId: The ID of the card
userId: The ID of the user activating the card
params: Object containing the field for use the card
*/
async function activateCardUseCase(cardId, userId, params){
    switch (getCardType(cardId)){
        case CardType.directAction:
            // Perform the action itself
            directAction(cardId, userId, params)
            break;
        case CardType.ownUserAction:
            // Check if the user already has the card activated
            ownUserAction(cardId, userId)
            break;
        case CardType.againstUserAction:
            // Check if the affected user is protected
            const againstUser = getUserAffectedId(params)
            againstUserAction(cardId, againstUser)
            break;
            
    }
    // Check and send the action message
    // Remove one from the quantity of cards from the user
    reduceCard(cardId, userId)
    return 'CARD_ACTION_COMPLETE'
}

// Check the action and perform the action for DIRECT CARDS
function directAction(cardId, userId, params){
    switch (cardId){
        case CardIds.removeMessage:
            removeMessage(getMessageAffectedId(params), getRoomAffectedId(params))
            break;
        case CardIds.decoyMessage:
            createDecoyMessage(getMessageBody(params), getMessageNickname(params), getRoomAffectedId(params))
            break;
        case CardIds.spiritRealm:
            changeLifeStatus(userId, LifeStatus.spirit)
            break;
        case CardIds.revive:
            changeLifeStatus(userId, LifeStatus.revive)
            break;
        case CardIds.healthPoisonPotion:
            changeLifeStatus(userId, LifeStatus.health)
            break;
        case CardIds.removeFromRoom:
            const isProtectedCardActive = isActiveCard(CardIds.shieldProtection, getUserAffectedId(params))
            if (!isProtectedCardActive){
                removeUserFromRoom(getRoomAffectedId(params), getUserAffectedId(params))
            }
            break;
    }
}

// Check the action and perform the action for OWN USER ACTION CARDS
function ownUserAction(cardId, userId){
    switch (cardId){
        case CardIds.unknowUser:
            activateCard(cardId, 5, userId)
            break;
        case CardIds.increaseLettersSize:
            activateCard(cardId, 10, userId)
            userChangeTextSize(20, userId)
            break;
        case CardIds.shieldProtection:
            activateCard(cardId, 1, userId)
            break;
        case CardIds.highlightMessage:
            activateCard(cardId, 10, userId)
            userChangeIsHightlight(true, userId)
            break;
        case CardIds.increaseCharacters:
            activateCard(cardId, 10, userId)
            userChangeCharacters(500, userId)
            break;
    }
}

// Check the action and perform the action for OWN USER ACTION CARDS
function againstUserAction(cardId, againstUser){
    const isProtectedCardActive = isActiveCard(CardIds.shieldProtection, againstUser)
    if (!isProtectedCardActive){
        switch(cardId){
            case CardIds.invertedLettersFont: 
                activateAgainstCard(cardId, 5, againstUser)
                userChangeFont("INVERTED", againstUser)
            break;
            case CardIds.reduceLettersSize: 
                activateAgainstCard(cardId, 10, againstUser)
                userChangeTextSize(8,againstUser)
            break;
            case CardIds.decreaseCharacters: 
                activateAgainstCard(cardId, 10, againstUser)
                userChangeCharacters(100, againstUser)
            break;
            case CardIds.lifePoison: 
                activateAgainstCard(cardId, 5, againstUser)
            break;
        }
    }
}

module.exports = {
    activateCardUseCase
}