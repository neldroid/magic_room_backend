const CardParams = {
    usersAffected : "USERS_AFFECTED",
    messagesAffected : "MESSAGES_AFFECTED",
    roomsAffected : "ROOMS_AFFECTED",
    messageBody: "MESSAGE_BODY",
    messageNickname: "MESSAGE_NICKNAME"
}

function getMessageAffectedId(params){
    return getMessageAffectedIds(params)[0]
}

function getMessageAffectedIds(params){
    return params[CardParams.messagesAffected]
}

function getUserAffectedId(params){
    return getUserAffectedIds(params)[0]
}

function getUserAffectedIds(params){
    return params[CardParams.usersAffected]
}

function getRoomAffectedId(params){
    return getRoomAffectedIds(params)[0]
}

function getRoomAffectedIds(params){
    return params[CardParams.roomsAffected]
}

function getMessageBody(params){
    return params[CardParams.messageBody]
}

function getMessageNickname(params){
    return params[CardParams.messageNickname]
}

module.exports = {
    getMessageAffectedId,
    getMessageAffectedIds,
    getRoomAffectedId,
    getRoomAffectedIds,
    getUserAffectedId,
    getUserAffectedIds,
    getMessageBody,
    getMessageNickname
}