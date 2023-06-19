const {getFirestore} = require("firebase-admin/firestore");

const db = getFirestore();

async function removeUserFromRoom(roomId, userId){
    // Remove the user from the list of users at the room
    db.collection('rooms').doc(roomId).collection('users').doc(userId).delete();
    // Remove the active room from the user
    const userRef = db.collection('users').doc(userId)

    try {
        await db.runTransaction(async (t) => {
            await t.get(userRef);

            t.update(userRef, {
                currentRoomId: "",
            });
        });
        // TODO CHANGE THE LOG MESSAGES
        console.log('Transaction success!');
        } catch (e) {
        console.log('Transaction failure:', e);
        }
}

async function addLastMessage(roomId, message){
    const roomRef = db.collection('rooms').doc(roomId)
    try {
        await db.runTransaction(async (t) => {
            await t.get(roomRef);

            t.update(roomRef, {
                lastMessage: message,
            });
        });
        // TODO CHANGE THE LOG MESSAGES
        console.log('Transaction success!');
        } catch (e) {
        console.log('Transaction failure:', e);
        }
}

module.exports = {
    removeUserFromRoom,
    addLastMessage
}