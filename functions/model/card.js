/*
Represents the card class contianig the information to execute an spell.
*/

class Card {
    constructor(id, type, rules) {
        this.id = id,
        this.type = type
        this.rules = rules// [Rule.rule1, Rule.rule3]
    }
}

// Set the entires IDs for the all cards
const CardIds = {
    // Direct action cards
    removeMessage : "REMOVE_MESSAGE_ID",
    decoyMessage : "DECOY_MESSAGE_ID",
    removeFromRoom : "REMOVE_FROM_ROOM_ID",
    healthPoisonPotion : "HEALTH_POTION_ID",
    spiritRealm : "SPIRIT_REALM_ID",
    revive : "REVIVE_ID",

    // Own user action cards
    unknowUser : "UNKNOW_USER_ID",
    increaseLettersSize : "INCREASE_LETTERS_ID",
    shieldProtection : "SHIELD_PROTECTION_ID",
    highlightMessage : "HIGHLIGHT_MESSAGE_ID",
    increaseCharacters : "INCREASE_CHARACTERS_ID",

    // Attack user action cards
    invertedLettersFont : "INVERTED_LETTERS_ID",
    reduceLettersSize : "REDUCE_LETTERS_ID",
    lifePoison : "LIFE_POISON_ID",
    decreaseCharacters : "DECREASE_CHARACTERS_ID",
}

const CardType = {
    directAction : "DIRECT_ACTION",
    ownUserAction : "OWN_USER_ACTION",
    againstUserAction : "AGAINST_USER_ACTION"
}

function getCardType(cardId){
    switch (cardId){
        case CardIds.removeMessage:
        case CardIds.decoyMessage:
        case CardIds.spiritRealm:
        case CardIds.removeFromRoom:
        case CardIds.revive:
        case CardIds.healthPoisonPotion:
            return CardType.directAction
        case CardIds.unknowUser:
        case CardIds.increaseLettersSize:
        case CardIds.shieldProtection:
        case CardIds.highlightMessage:
        case CardIds.increaseCharacters:
            return CardType.ownUserAction
        case CardIds.invertedLettersFont:
        case CardIds.reduceLettersSize:
        case CardIds.lifePoison:
        case CardIds.decreaseCharacters:
            return CardType.againstUserAction

    }
}

module.exports = {
    Card,
    CardIds,
    CardType,
    getCardType
  };