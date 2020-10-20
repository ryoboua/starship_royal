const Room = require("../classes/Room")
const {
    GAME_STATE_UPDATE,
    GAME_OVER,
    GAME_ACTIVE,
    CLEAR_CANVAS,
    ROUND_OVER,
    PLAYER_ADDED,
    PLAYER_REMOVED,
    LOAD_LEVEL,
    COUNTDOWN
} = require("../events")

const rooms = new Map()

function createRoom(roomName, client, emit) {
    rooms.set(roomName, Room.createRoom(client, emit))
}

function addClient(roomName, client) {
    const room = rooms.get(roomName)
    room.addClient(client)
    room.emit(PLAYER_ADDED, room.getClientList())
}

function removeClient(roomName, socketId) {
    if (!rooms.has(roomName)) {
        return
    }

    const room = rooms.get(roomName)
    room.removeClient(socketId)
    room.emit(PLAYER_REMOVED, room.getClientList())
}


function isRoundActive(roomName) {
    if (!rooms.has(roomName)) {
        return
    }

    return rooms.get(roomName).isRoundActive()
}

module.exports = { createRoom, addClient, removeClient, isRoundActive }