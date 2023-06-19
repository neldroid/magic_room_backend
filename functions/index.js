// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// Project imports
const { activateCardUseCase } = require("./domain/activateCardUseCase.js");
const { sendMessageUseCase } = require("./domain/sendMessageUseCase.js");
const { handleFinishedCard } = require("./domain/handleFinishedCardsUseCase.js");
const { CardType } = require("./model/card.js");

/* Function called when an user activates a Card
Parameters in the request:
cardId -> The cardId for the active card
userId -> The user that activates the card
params -> Any extra parameter needed by the card to do their job
*/
exports.activatecard = onRequest(async (req, res) => {
  // Content from header
  const cardId = req.query.cardId
  const userId = req.query.userId
  const params = {}
  if (req.query.params !== undefined) {
    params = JSON.parse(req.query.params)
  }

  const activatedCardResult = await activateCardUseCase(cardId, userId, params)

  res.json({ result: activatedCardResult });
});

exports.addMessage = onDocumentCreated("/rooms/{roomId}/messages/{messageId}", (event) => {
  const message = event.data.data();
  const userId = message.senderId
  const roomId = event.params.roomId

  sendMessageUseCase(userId, roomId, message)
});

/*
Check every time that the 'actionTime' of the card changes
*/
exports.ownSpellFinished = onDocumentUpdated("/users/{userId}/cards/{cardId}", (event) => {
  callSpellFinishUseCase(event, CardType.ownUserAction);
});

exports.againstSpellFinished = onDocumentUpdated("/users/{userId}/againstCards/{cardId}", (event) => {
  callSpellFinishUseCase(event, CardType.againstUserAction);
});

function callSpellFinishUseCase(event, cardType) {
  const beforeCard = event.data.before.data();
  const card = event.data.after.data();

  // Check only the change from 1 to 0. Avoiding recursion
  if (beforeCard.actionTime === 1 && card.actionTime === 0) {
    const cardId = event.params.cardId
    const userId = event.params.userId

    handleFinishedCard(cardId, userId, cardType)
  }
}