const Client = require("../classes/Client")
const {
  NEW_GAME,
  JOIN_GAME_ACCEPTED,
  ROUND_ACTIVE
} = require("../events")
const {
  createGame,
  addPlayer,
  removePlayer,
  gameHandleKeyDown,
  gameHandleKeyUp,
  startRound,
  isRoundActive
} = require("./game")
const { createRoom, addClient, removeClient } = require("./room")
const { makeid } = require("../utils")

const clientList = new Map()

function handleNewGame(socket, name, initGameEmitter) {
  const roomName = makeid(5)
  socket.join(roomName, (err) => {
    if (err) {
      return
    }
    const playerNumber = 1

    const client = new Client({
      socketId: socket.id,
      name,
      roomName,
      playerNumber,
      host: true,
    })

    clientList.set(client.socketId, client)
    createRoom(roomName, client, initGameEmitter(roomName))
    socket.emit(NEW_GAME, client)
  })
}

function joinRoom(socket, roomName, name, numClients) {
  if (isRoundActive(roomName)) {
    return socket.emit(ROUND_ACTIVE, {
      header: `Unable to join while round active`,
    })
  }

  socket.join(roomName, (err) => {
    if (err) {
      return console.log(`Error trying to join room ${roomName}`)
    }
    const playerNumber = numClients + 1

    const client = new Client({
      socketId: socket.id,
      name,
      roomName,
      playerNumber,
    })

    clientList.set(client.socketId, client)
    addClient(roomName, client)
    socket.emit(JOIN_GAME_ACCEPTED, client)
  })
}

function handleDisconnect(socket) {
  if (!clientList.has(socket.id)) {
    return
  }
  const roomName = clientList.get(socket.id).getRoomName()
  removeClient(roomName, socket.id)
  clientList.delete(socket.id)
}

function handleKeyDown(socket, keyCode) {
  if (!clientList.has(socket.id)) {
    return
  }

  const client = clientList.get(socket.id)

  try {
    keyCode = parseInt(keyCode)
  } catch (e) {
    console.log(e)
    return
  }
  gameHandleKeyDown(client, keyCode)
}

function handleKeyUp(socket, keyCode) {
  if (!clientList.has(socket.id)) {
    return
  }

  const client = clientList.get(socket.id)

  try {
    keyCode = parseInt(keyCode)
  } catch (e) {
    console.log(e)
    return
  }
  gameHandleKeyUp(client, keyCode)
}

function handleStartGame(socket) {
  if (!clientList.has(socket.id)) {
    return
  }
  const client = clientList.get(socket.id)

  if (!client.host) {
    return
  }
  const roomName = client.getRoomName()

  startRound(roomName)
}

module.exports = {
  joinRoom,
  handleNewGame,
  handleKeyDown,
  handleKeyUp,
  handleDisconnect,
  handleStartGame,
}
