import Client from "../../game/classes/Client"
import socketIO from "socket.io"

import {
  createRoom,
  addPlayer,
  removePlayer,
  startRound,
  endRound,
  isRoundActive
} from "../../game/controllers/clientRoomController"
import { makeid } from "../utils"
import {
  ROUND_ACTIVE,
  KEY_DOWN,
  KEY_UP,
  PLAYER_DEAD,
} from "../../appEvent"

const clientList = new Map()

export function handleNewGame(socket: socketIO.Socket, name: string, initGameEmitter: any, resFn: any) {

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

export function joinRoom(socket: socketIO.Socket, roomName: string, name: string, numClients: number, resFn: any) {
  if (isRoundActive(roomName)) {
    const err = {
      header: `Unable to join while round active`,
    }
    return resFn(null, err)
  }
  socket.join(roomName, (err) => {
    if (err) {
      return resFn(null, {
        header: `Error trying to join room ${roomName}`,
        body: err
      })
    }
    const playerNumber = numClients + 1

    const client = new Client({
      socketId: socket.id,
      name,
      roomName,
      playerNumber,
      host: false
    })

    clientList.set(client.socketId, client)
    addPlayer(roomName, client, socket, resFn)
  })
}

export function handleDisconnect(socket: socketIO.Socket) {
  if (!clientList.has(socket.id)) {
    return
  }
  const roomName = clientList.get(socket.id).getRoomName()
  removePlayer(roomName, socket.id)
  clientList.delete(socket.id)
}

export function handleKeyDown(socket: socketIO.Socket, keyCode: number) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).getRoomName()

  if (!isRoundActive(roomName)) {
    return
  }

  // try {
  //   keyCode = parseInt(keyCode)
  // } catch (e) {
  //   console.log(e)
  //   return
  // }
  socket.to(roomName).broadcast.emit(KEY_DOWN, { keyCode, socketId: socket.id })
}

export function handleKeyUp(socket: socketIO.Socket, keyCode: number) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).getRoomName()

  if (!isRoundActive(roomName)) {
    return
  }

  // try {
  //   keyCode = parseInt(keyCode)
  // } catch (e) {
  //   console.log(e)
  //   return
  // }
  socket.to(roomName).broadcast.emit(KEY_UP, { keyCode, socketId: socket.id })
}

export function handleStartRound(socket: socketIO.Socket) {
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

export function handleEndRound(socket: socketIO.Socket) {
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

export function handleDeadPlayer(socket: socketIO.Socket, deadPlayerSocketId: string) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).getRoomName()

  if (!isRoundActive(roomName)) {
    return
  }
  socket.to(roomName).broadcast.emit(PLAYER_DEAD, deadPlayerSocketId)
}
