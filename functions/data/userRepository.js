const { getFirestore } = require("firebase-admin/firestore");
const { LifeStatus } = require("../model/user");

const db = getFirestore();

function decreaseGems(gemsQuantity, userId) {
  updateGems((gemsQuantity * -1), userId)
}

function increaseGems(gemsQuantity, userId) {
  updateGems(gemsQuantity, userId)
}

async function updateGems(gemsQuantity, userId) {
  const userRef = db.collection('users').doc(userId);

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);

      const newGems = doc.data().gems + gemsQuantity;
      t.update(userRef, { gems: newGems });
    });
    // TODO CHANGE THE LOG MESSAGES
    console.log('Transaction success!');
  } catch (e) {
    console.log('Transaction failure:', e);
  }
}

/* Activate the card. Needs cardId to identify the card
The actionTime: Represents the quantity of iteractions (messages, attacks, etc) while
the card remains active
*/
async function activateCard(cardId, actionTime, userId) {
  const activeCardRef = db.collection('users').doc(userId).collection('cards').doc(cardId);

  try {
    await db.runTransaction(async (t) => {
      t.update(activeCardRef, {
        isActive: true,
        actionTime: actionTime
      });
    });
    // TODO CHANGE THE LOG MESSAGES
    console.log('Transaction success!');
  } catch (e) {
    console.log('Transaction failure:', e);
  }
}

async function deactivateCard(cardId, userId) {
  const activeCardRef = db.collection('users').doc(userId).collection('cards').doc(cardId);

  try {
    await db.runTransaction(async (t) => {
      t.update(activeCardRef, {
        isActive: false
      });
    });
    // TODO CHANGE THE LOG MESSAGES
    console.log('Transaction success!');
  } catch (e) {
    console.log('Transaction failure:', e);
  }
}

async function reduceUserCard(cardId, userId, quantity = 1) {
  reduceCard(cardId, userId, quantity, 'cards')
}

async function reduceUserAgainstCard(cardId, userId, quantity = 1) {
  reduceCard(cardId, userId, quantity, 'againstCards')
}

/*
Reduce the amount of cards
*/
async function reduceCard(cardId, userId, quantity = 1, reference) {
  const cardRef = db.collection('users').doc(userId).collection(reference).doc(cardId);
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(cardRef);

      const newCardQuantity = doc.data().quantity - quantity;
      t.update(cardRef, { quantity: newCardQuantity });
    });
    // TODO CHANGE THE LOG MESSAGES
    console.log('Transaction success!');
  } catch (e) {
    console.log('Transaction failure:', e);
  }
}

async function activateAgainstCard(cardId, actionTime, userId) {
  const activeCardRef = db.collection('users').doc(userId).collection('againstCards').doc(cardId);

  try {
    await db.runTransaction(async (t) => {
      await t.get(activeCardRef);

      t.update(activeCardRef, {
        isActive: true,
        actionTime: actionTime
      });
    });
    // TODO CHANGE THE LOG MESSAGES
    console.log('Transaction success!');
  } catch (e) {
    console.log('Transaction failure:', e);
  }
}

async function isActiveCard(cardId, userId) {
  let result = false
  //Firebase query to get the active card
  const cardsRef = db.collection('users').doc(userId).collection('cards');
  const snapshot = await cardsRef.where('isActive', '==', true).get();
  if (snapshot.empty) {
    result = false
  }
  snapshot.collectionforEach(doc => {
    // It it's a new active card, activate it and deactivate the current one
    if (doc.id !== cardId) {
      result = false
    } else {
      result = true
    }
  });
  return result
}

function userChangeTextSize(value, userId) {
  changeMessageConfiguration(value, userId, 'size');
}

function userChangeIsHightlight(value, userId) {
  changeMessageConfiguration(value, userId, 'highlight');
}

function userChangeCharacters(value, userId) {
  changeMessageConfiguration(value, userId, 'characters');
}

function userChangeFont(value, userId) {
  changeMessageConfiguration(value, userId, 'font');
}

async function changeMessageConfiguration(value, userId, reference) {
  const userReference = db.collection('users').doc(userId);

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userReference);

      const messageConfigurationMap = doc.data().messageConfiguration
      messageConfigurationMap[reference] = value

      t.update(userReference, {
        messageConfiguration: messageConfigurationMap,
      });
    });
    // TODO CHANGE THE LOG MESSAGES
    console.log('Transaction success!');
  } catch (e) {
    console.log('Transaction failure:', e);
  }
}

async function restoreNickname(userId) {
  const userReference = db.collection('users').doc(userId);
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userReference);

      const messageConfigurationMap = doc.data().messageConfiguration
      const realNickname = doc.data().nickname

      messageConfigurationMap['nickname'] = realNickname

      t.update(userReference, {
        messageConfiguration: messageConfigurationMap,
      });
    });
    // TODO CHANGE THE LOG MESSAGES
    console.log('Transaction success!');
  } catch (e) {
    console.log('Transaction failure:', e);
  }
}

function changeLifeStatus(userId, lifeStatus) {
  switch (lifeStatus) {
    case (LifeStatus.spirit):
      changeLifeStatusConfiguration(0, userId)
      break;
    case (LifeStatus.revive):
      changeLifeStatusConfiguration(5, userId)
      break;
    case (LifeStatus.health):
      //changeLifeStatusConfiguration(-1, userId)
      break;
  }
}

async function changeLifeStatusConfiguration(value, userId) {
  const userReference = db.collection('users').doc(userId);

  try {
    await db.runTransaction(async (t) => {
      t.update(userReference, {
        life: value,
      });
    });
    // TODO CHANGE THE LOG MESSAGES
    console.log('Transaction success!');
  } catch (e) {
    console.log('Transaction failure:', e);
  }
}

async function decreaseactionTimeAllUserCards(userId) {
  decreaseActionTimeCards(userId, 'cards')
}

async function decreaseactionTimeAllUserAgainstCards(userId) {
  decreaseActionTimeCards(userId, 'againstCards')
}

/*
Reduce all cards in the reference
*/
async function decreaseActionTimeCards(userId, reference) {
  db.collection('users').doc(userId).collection(reference).get().then(function (querySanpshot) {
    querySanpshot.forEach(function (doc) {
      if (doc.data().actionTime > 0) {
        const newactionTime = doc.data().actionTime - 1;

        doc.ref.update({
          actionTime: newactionTime
        })
      }
    });
  });
}

async function deleteAgainstCard(cardId, userId) {
  await db.collection('users').doc(userId).collection('againstCards').doc(cardId).delete();
}

module.exports = {
  decreaseGems,
  increaseGems,

  activateCard,
  isActiveCard,
  activateAgainstCard,
  deactivateCard,

  userChangeTextSize,
  userChangeIsHightlight,
  userChangeCharacters,
  userChangeFont,

  changeLifeStatus,

  decreaseactionTimeAllUserAgainstCards,
  decreaseactionTimeAllUserCards,

  reduceUserAgainstCard,
  reduceUserCard,

  deleteAgainstCard,

  restoreNickname
};