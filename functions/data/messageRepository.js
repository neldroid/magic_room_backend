const {getFirestore} = require("firebase-admin/firestore");
const { MessageType } = require("../model/message");

const db = getFirestore();


function removeMessage(messageId, roomId){
    db.collection('rooms').doc(roomId).collection('messages').doc(messageId).delete();
}

function createDecoyMessage(decoyMessage, decoyNickname, roomId){
    const decoyMessageData = {
        message: decoyMessage,
        nickname: decoyNickname,
        type: MessageType.decoy
      };
      
      db.collection('rooms').doc(roomId).collection('messages').add(decoyMessageData);
}

async function saveMessageMerge(messageId, roomId, message){
    console.log("ENTRA AL GUARDAR MENSAJE INCOGNITO")
    console.log(message)
    await db.collection('rooms').doc(roomId).collection('messages').doc(messageId).set({message}, {merge: true});
}

module.exports = {
    removeMessage,
    createDecoyMessage,
    saveMessageMerge
}