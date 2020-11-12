import { joinGameResponseCallBack, Emit } from "../../shared/interfaces"
import { BackendSocket } from "../../shared/types"
import Room from "../../shared/classes/ClientRoom"
import Client from "../../shared/classes/Client"

const rooms = new Map()

export function createRoom(roomName: string, players: Array<Client>, emit: Emit) {
  rooms.set(roomName, Room.createClientRoom(players, emit))
}

export function addPlayer(roomName: string, client: Client, socket: BackendSocket, resFn: joinGameResponseCallBack) {
  if (!rooms.has(roomName)) {
    return
  }
  const room = rooms.get(roomName)
  room.addPlayer(client)
  const players = room.getPlayerList()
  resFn({ client, players })
  socket.to(roomName).broadcast.emit("addPlayer", client)
}

export function removePlayer(roomName: string, socketId: string) {
  if (!rooms.has(roomName)) {
    return
  }

  const room = rooms.get(roomName)
  room.removePlayer(socketId)
  room.emit("removePlayer", socketId)
}

export function removeRoom(roomName: string) {
  if (!rooms.has(roomName)) {
    return
  }


}

function gameKeyDown(client: Client, keyCode: number, socket: BackendSocket) {
  const roomName = client.roomName
  if (!rooms.has(roomName)) {
    return
  }
}

function gameKeyUp(client: Client, keyCode: number, socket: BackendSocket) {
  const roomName = client.roomName
  if (!rooms.has(roomName)) {
    return
  }
}

export function startRound(roomName: string) {
  if (!rooms.has(roomName)) {
    return
  }
  const room = rooms.get(roomName)
  room.setRoundStatus(true)
  const sequence = room.generateSequence()
  room.emit("startRound", sequence)
}

export function endRound(roomName: string) {
  if (!rooms.has(roomName)) {
    return
  }
  const room = rooms.get(roomName)
  room.setRoundStatus(false)
}

export function isRoundActive(roomName: string) {
  if (!rooms.has(roomName)) {
    return
  }

  return rooms.get(roomName).roundActive
}
