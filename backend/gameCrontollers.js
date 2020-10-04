const Game = require("./classes/Game")
const Client = require("./classes/Client")
const { FRAME_RATE, GAME_OVER_REASONS } = require("./constants")

const gameStates = new Map()

function initGame(roomName, client) {
  gameStates.set(roomName, Game.createGameState(client))
}

function addPlayer(roomName, client) {
  const startPosition = { x: client.playerNumber * 200, y: 500 }
  gameStates.get(roomName).addPlayer(client, startPosition)
}

function gameHandleKeydown(client, keyCode) {
  const player = gameStates.get(client.roomName).players[client.socketId]

  if (!player) {
    return
  }

  player.keys.updateKeysDown(keyCode)
  player.updateVelocityKeyDown(keyCode)
}

function gameHandleKeyUp(client, keyCode) {
  const player = gameStates.get(client.roomName).players[client.socketId]

  if (!player) {
    return
  }

  player.keys.updateKeysUp(keyCode)
  player.updateVelocityKeyUp(keyCode)
}

module.exports = { initGame, addPlayer, gameHandleKeydown, gameHandleKeyUp }
