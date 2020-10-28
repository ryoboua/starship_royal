const Room = require("../classes/clientRoom")
const {
  ADD_PLAYER,
  REMOVE_PLAYER,
  START_ROUND,
} = require("../../appEvent")

const rooms = new Map()

function createRoom(roomName, players, emit) {
  rooms.set(roomName, Room.createClientRoom(players, emit))
}

function addPlayer(roomName, client, socket, resFn) {
  if (!rooms.has(roomName)) {
    return
  }
  const room = rooms.get(roomName)
  room.addPlayer(client)
  const players = room.getPlayerList()
  resFn({ client, players })
  socket.to(roomName).broadcast.emit(ADD_PLAYER, client)
}

function removePlayer(roomName, socketId) {
  if (!rooms.has(roomName)) {
    return
  }

  const room = rooms.get(roomName)
  room.removePlayer(socketId)
  room.emit(REMOVE_PLAYER, socketId)
}

function gameKeyDown(client, keyCode, socket) {
  const roomName = client.roomName
  if (!rooms.has(roomName)) {
    return
  }
}

function gameKeyUp(client, keyCode, socket) {
  const roomName = client.roomName
  if (!rooms.has(roomName)) {
    return
  }
}

function startRound(roomName) {
  if (!rooms.has(roomName)) {
    return
  }
  const room = rooms.get(roomName)
  room.setRoundStatus(true)
  const sequence = room.generateSequence()
  room.emit(START_ROUND, sequence)
}

function endRound(roomName) {
  if (!rooms.has(roomName)) {
    return
  }
  const room = rooms.get(roomName)
  room.setRoundStatus(false)
}

function isRoundActive(roomName) {
  if (!rooms.has(roomName)) {
    return
  }

  return rooms.get(roomName).isRoundActive()
}

module.exports = {
  createRoom,
  addPlayer,
  removePlayer,
  gameKeyDown,
  gameKeyUp,
  startRound,
  endRound,
  isRoundActive
}
