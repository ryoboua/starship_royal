import { SocketType as Socket } from "./../../types"
import Room from "../classes/ClientRoom"
import {
  ADD_PLAYER,
  REMOVE_PLAYER,
  START_ROUND,
} from "../../appEvents"
import Client from "../classes/Client"

const rooms = new Map()

export function createRoom(roomName: string, players: Array<Client>, emit: any) {
  rooms.set(roomName, Room.createClientRoom(players, emit))
}

export function addPlayer(roomName: string, client: Client, socket: Socket, resFn: any) {
  if (!rooms.has(roomName)) {
    return
  }
  const room = rooms.get(roomName)
  room.addPlayer(client)
  const players = room.getPlayerList()
  resFn({ client, players })
  socket.to(roomName).broadcast.emit("ACTION", { mutation: ADD_PLAYER, data: client })
}

export function removePlayer(roomName: string, socketId: string) {
  if (!rooms.has(roomName)) {
    return
  }

  const room = rooms.get(roomName)
  room.removePlayer(socketId)
  room.emit(REMOVE_PLAYER, socketId)
}

function gameKeyDown(client: Client, keyCode: number, socket: Socket) {
  const roomName = client.roomName
  if (!rooms.has(roomName)) {
    return
  }
}

function gameKeyUp(client: Client, keyCode: number, socket: Socket) {
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
  room.emit(START_ROUND, sequence)
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

  return rooms.get(roomName).isRoundActive()
}
