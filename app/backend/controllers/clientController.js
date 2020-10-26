const Client = require("../../game/classes/Client")
const {
  ROUND_ACTIVE,
  KEY_DOWN,
  KEY_UP,
  PLAYER_DEAD,
} = require("../../appEvent")
const {
  createRoom,
  addPlayer,
  removePlayer,
  startRound,
  endRound,
  gameKeyDown,
  gameKeyUp,
  isRoundActive
} = require("../../game/controllers/clientRoomController")
const { makeid } = require("../utils")

const clientList = new Map()

function handleNewGame(socket, name, initGameEmitter, resFn) {

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
    createRoom(roomName, [client], initGameEmitter(roomName))
    resFn(client)
  })
}

function joinRoom(socket, roomName, name, numClients, resFn) {
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
    addPlayer(roomName, client, socket, resFn)
  })
}

function handleDisconnect(socket) {
  if (!clientList.has(socket.id)) {
    return
  }
  const roomName = clientList.get(socket.id).getRoomName()
  removePlayer(roomName, socket.id)
  clientList.delete(socket.id)
}

function handleKeyDown(socket, keyCode) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).getRoomName()

  if (!isRoundActive(roomName)) {
    return
  }

  try {
    keyCode = parseInt(keyCode)
  } catch (e) {
    console.log(e)
    return
  }
  socket.to(roomName).broadcast.emit(KEY_DOWN, { keyCode, socketId: socket.id })
}

function handleKeyUp(socket, keyCode) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).getRoomName()

  if (!isRoundActive(roomName)) {
    return
  }

  try {
    keyCode = parseInt(keyCode)
  } catch (e) {
    console.log(e)
    return
  }
  socket.to(roomName).broadcast.emit(KEY_UP, { keyCode, socketId: socket.id })
}

function handleStartRound(socket) {
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

function handleEndRound(socket) {
  if (!clientList.has(socket.id)) {
    return
  }
  const client = clientList.get(socket.id)

  if (!client.host) {
    return
  }
  const roomName = client.getRoomName()
  endRound(roomName)
}

function handleDeadPlayer(socket, deadPlayerSocketId) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).getRoomName()

  if (!isRoundActive(roomName)) {
    return
  }
  socket.to(roomName).broadcast.emit(PLAYER_DEAD, deadPlayerSocketId)
}

module.exports = {
  joinRoom,
  handleNewGame,
  handleKeyDown,
  handleKeyUp,
  handleDisconnect,
  handleStartRound,
  handleEndRound,
  handleDeadPlayer,
}
