const MessageType = {
    normal: "NORMAL_MESSAGE",
    decoy: "DECOY_MESSAGE"
}

const defaultMessageStyle = {
        backgroundColor:"#000",
        textSize:10,
        textFont:"NORMAL",
        textColor:"#FFF"
}

const defaultMessageUser = {
    nickname: "******",
}

const defaultMessageConfiguration = {
    isHighLight:false,
    quantityCharacteres:250
}

module.exports = {
    MessageType,
    defaultMessageUser,
    defaultMessageConfiguration,
    defaultMessageStyle
}