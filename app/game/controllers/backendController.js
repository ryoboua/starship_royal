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
  JOIN_GAME_ACCEPTED,
  KEY_DOWN,
  KEY_UP,
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

function gameKeyDown(client, keyCode, socket) {
  const roomName = client.roomName
  if (!gameStates.has(roomName)) {
    return
  }
}

function gameKeyUp(client, keyCode, socket) {
  const roomName = client.roomName
  if (!gameStates.has(roomName)) {
    return
  }
}

function startRound(roomName) {
  if (!gameStates.has(roomName)) {
    return
  }
  const game = gameStates.get(roomName)
  game.setRoundStatus(true)
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
  gameKeyDown,
  gameKeyUp,
  startRound,
  isRoundActive
}
