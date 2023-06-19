const { deactivateCard, deleteAgainstCard, userChangeTextSize, userChangeIsHightlight, userChangeCharacters, restoreNickname, changeLifeStatus } = require("../data/userRepository");
const { CardType, CardIds } = require("../model/card");
const { defaultMessageStyle, defaultMessageConfiguration } = require("../model/message");
const { LifeStatus } = require("../model/user");

async function handleFinishedCard(cardId, userId, type){
    console.log("HANDLE FINISH CARD USE CASE FOR userId:"+userId+ " cardId:"+cardId+" type:"+type)

    switch (type){
        case CardType.ownUserAction:
            handleOwnFinishedCard(cardId, userId)
            break;
        case CardType.againstUserAction:
            handleAgainstFinishedCard(cardId, userId)
    }
}

async function handleOwnFinishedCard(cardId, userId){
    // Deactivate the current card 
    deactivateCard(cardId, userId)

    switch(cardId){
        case CardIds.unknowUser:
            restoreNickname(userId)
            break;
        case CardIds.increaseLettersSize:
            userChangeTextSize(defaultMessageStyle.textSize, userId)
            break;
        case CardIds.highlightMessage:
            userChangeIsHightlight(defaultMessageConfiguration.isHighLight, userId)
            break;
        case CardIds.increaseCharacters:
            userChangeCharacters(defaultMessageConfiguration.quantityCharacteres, userId)
            break; 
    }
}

async function handleAgainstFinishedCard(cardId, userId){
    // Delete the document
    deleteAgainstCard(cardId, userId)

    switch(cardId){
        case CardIds.invertedLettersFont: 
                userChangeFont(defaultMessageStyle.textFont, userId)
            break;
            case CardIds.reduceLettersSize: 
                userChangeTextSize(defaultMessageStyle.textSize, userId)
            break;
            case CardIds.decreaseCharacters: 
                userChangeCharacters(defaultMessageConfiguration.quantityCharacteres, userId)
            break;
            case CardIds.lifePoison: 
                changeLifeStatus(userId, LifeStatus.spirit)
            break;
    }
}

module.exports = {
    handleFinishedCard
}