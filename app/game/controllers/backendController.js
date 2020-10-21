const Game = require("../classes/GameBackend")
const { FRAME_RATE } = require("../constants")
const { GAME_OVER_REASONS } = require("../constants")
const levelParams = require("../levels")
const MAX_LEVEL = levelParams.length
const {
  GAME_STATE_UPDATE,
  GAME_OVER,
  GAME_ACTIVE,
  CLEAR_CANVAS,
  ROUND_OVER,
  PLAYER_ADDED,
  PLAYER_REMOVED,
  LOAD_LEVEL,
  COUNTDOWN,
  JOIN_GAME_ACCEPTED
} = require("../../appEvent")

const gameStates = new Map()

function createGame(roomName, players, emit) {
  gameStates.set(roomName, Game.createGameState(players, emit))
}

async function addPlayer(roomName, client, socket) {
  if (!gameStates.has(roomName)) {
    return
  }
  const game = gameStates.get(roomName)
  game.addPlayer(client)
  const players = game.getPlayerList()
  socket.emit(JOIN_GAME_ACCEPTED, { client, players })
  socket.broadcast.emit(PLAYER_ADDED, client)
}

function removePlayer(roomName, socketId) {
  if (!gameStates.has(roomName)) {
    return
  }

  const game = gameStates.get(roomName)
  game.removePlayer(socketId)
  game.emit(PLAYER_REMOVED, socketId)
}

function gameHandleKeyDown(client, keyCode) {
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

function startRound(roomName) {
  if (!gameStates.has(roomName)) {
    return
  }
  const game = gameStates.get(roomName)

  game.emit("START_ROUND")
}

function isRoundActive(roomName) {
  if (!gameStates.has(roomName)) {
    return
  }

  return gameStates.get(roomName).isRoundActive()
}

module.exports = {
  createGame,
  addPlayer,
  removePlayer,
  gameHandleKeyDown,
  gameHandleKeyUp,
  startRound,
  isRoundActive
}
