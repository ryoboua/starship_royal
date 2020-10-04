const Game = require("./classes/Game")
const Client = require("./classes/Client")
const { FRAME_RATE, GAME_OVER_REASONS } = require("./constants")
const { initGame, addPlayer, gameHandleKeydown, gameHandleKeyUp } = require("./gameCrontollers")
const { makeid } = require("./utils")
const {
  NEW_GAME,
  START_GAME,
  JOIN_GAME,
  JOIN_GAME_ACCEPTED,
  KEY_DOWN,
  KEY_UP,
  UNKNOWN_CODE,
  TOO_MANY_PLAYERS,
  GAME_STATE_UPDATE,
  GAME_OVER,
  GAME_ACTIVE,
  CLEAR_CANVAS,
  PLAYER_ADDED,
  PLAYER_REMOVED,
  DISCONNECT,
} = require("./events")

const clientList = new Map()

function createNewGame(socketId, name) {
  const roomName = makeid(5)
  const playerNumber = 1
  const client = new Client(socketId, name, roomName, playerNumber, true)
  clientList.set(socketId, client)
  initGame(roomName, client)
  return client
}

function joinGame(socketId, roomName, name, numClients) {
  const playerNumber = numClients + 1

  const client = new Client(socketId, name, roomName, playerNumber)
  clientList.set(socketId, client)

  addPlayer(roomName, client)

  return [client, getAllClientsInRoom(roomName)]
}

function handleKeydown(socketId, keyCode) {
  try {
    keyCode = parseInt(keyCode)
  } catch (e) {
    console.log(e)
    return
  }

  if (!clientList.has(socketId)) {
    return
  }

  const client = clientList.get(socketId)

  gameHandleKeydown(client, keyCode)
}
function handleKeyUp(socketId, keyCode) {
  try {
    keyCode = parseInt(keyCode)
  } catch (e) {
    console.log(e)
    return
  }

  if (!clientList.has(socketId)) {
    return
  }

  const client = clientList.get(socketId)

  gameHandleKeyUp(client, keyCode)
}

function processDisconnect(socketId) {
  if (!clientList.has(socketId)) {
    return
  }
  const roomName = clientList.get(socketId).getRoomName()
  clientList.delete(socketId)
  
  return [roomName, getAllClientsInRoom(roomName)]
}

function getAllClientsInRoom(room) {
  const players = []
  clientList.forEach((client) => {
    if (client.roomName === room) {
      players.push(client)
    }
  })

  return players
}
module.exports = {
  createNewGame,
  joinGame,
  handleKeydown,
  handleKeyUp,
  processDisconnect,
}
