const Client = require("../classes/Client")
const {
  initGame,
  addPlayer,
  gameHandleKeyDown,
  gameHandleKeyUp,
  startGameInterval,
} = require("./game")
const { makeid } = require("../utils")

const clientList = new Map()

function createNewGame(socketId, name) {
  const roomName = makeid(5)
  const playerNumber = 1
  const client = new Client(socketId, name, roomName, playerNumber, true)
  clientList.set(socketId, client)
  initGame(roomName, client)
  return client
}

function joinRoom(socketId, roomName, name, numClients) {
  const playerNumber = numClients + 1

  const client = new Client(socketId, name, roomName, playerNumber)
  clientList.set(socketId, client)

  addPlayer(roomName, client)

  return [client, getAllClientsInRoom(roomName)]
}

function processDisconnect(socketId) {
  if (!clientList.has(socketId)) {
    return
  }
  const roomName = clientList.get(socketId).getRoomName()
  clientList.delete(socketId)

  return [roomName, getAllClientsInRoom(roomName)]
}

function handleKeyDown(socketId, keyCode) {
  if (!clientList.has(socketId)) {
    return
  }

  const client = clientList.get(socketId)

  try {
    keyCode = parseInt(keyCode)
  } catch (e) {
    console.log(e)
    return
  }
  gameHandleKeyDown(client, keyCode)
}

function handleKeyUp(socketId, keyCode) {
  if (!clientList.has(socketId)) {
    return
  }

  const client = clientList.get(socketId)

  try {
    keyCode = parseInt(keyCode)
  } catch (e) {
    console.log(e)
    return
  }
  gameHandleKeyUp(client, keyCode)
}

function startGame(socketId, gameEventEmitter) {
  if (!clientList.has(socketId)) {
    return
  }
  const client = clientList.get(socketId)

  if (!client.host) {
    return
  }
  const roomName = client.getRoomName()

  startGameInterval(roomName, gameEventEmitter)
}

function getAllClientsInRoom(room) {
  const clients = []
  clientList.forEach((client) => {
    if (client.roomName === room) {
      clients.push(client)
    }
  })

  return clients
}

module.exports = {
  createNewGame,
  joinRoom,
  handleKeyDown,
  handleKeyUp,
  processDisconnect,
  startGame,
}
