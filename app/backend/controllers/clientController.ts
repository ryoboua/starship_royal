import Client from "../../shared/classes/Client"
import { BackendSocket } from "../../shared/types"
import {
  createRoom,
  addPlayer,
  removePlayer,
  startRound,
  endRound,
  isRoundActive,
  removeRoom
} from "../../game/controllers/clientRoomController"
import { makeid } from "../../shared/utils"
import { joinGameResponseCallBack, ClientRoomEmitter } from "../../shared/interfaces"

const clientList = new Map()

export function handleNewGame(socket: BackendSocket, name: string, initGameEmitter: ClientRoomEmitter, resFn: any) {
  console.log('yoyo')
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

export function joinRoom(socket: BackendSocket, roomName: string, name: string, numClients: number, resFn: joinGameResponseCallBack) {
  if (isRoundActive(roomName)) {
    const err = {
      header: `Unable to join while round active`,
      body: "",
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

export function handleDisconnect(socket: BackendSocket) {
  if (!clientList.has(socket.id)) {
    return
  }
  const client = clientList.get(socket.id)
  const { roomName } = client
  if (client.host) {
    removeRoom(roomName)
  } else {
    removePlayer(roomName, socket.id)
    clientList.delete(socket.id)
  }
}

export function handleKeyDown(socket: BackendSocket, keyCode: number) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).roomName

  if (!isRoundActive(roomName)) {
    return
  }

  socket.to(roomName).broadcast.emit("keydown", { keyCode, socketId: socket.id })
}

export function handleKeyUp(socket: BackendSocket, keyCode: number) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).roomName

  if (!isRoundActive(roomName)) {
    return
  }

  socket.to(roomName).broadcast.emit("keyup", { keyCode, socketId: socket.id })
}

export function handleStartRound(socket: BackendSocket) {
  if (!clientList.has(socket.id)) {
    return
  }
  const client = clientList.get(socket.id)

  if (!client.host) {
    return
  }
  const roomName = client.roomName
  startRound(roomName)
}

export function handleEndRound(socket: BackendSocket) {
  if (!clientList.has(socket.id)) {
    return
  }
  const client = clientList.get(socket.id)

  if (!client.host) {
    return
  }
  const roomName = client.roomName
  endRound(roomName)
}

export function handleDeadPlayer(socket: BackendSocket, deadPlayerSocketId: string) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).roomName

  if (!isRoundActive(roomName)) {
    return
  }
  socket.to(roomName).broadcast.emit("playerDead", deadPlayerSocketId)
}
