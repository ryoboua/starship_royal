import Client from "../../shared/classes/Client"
import { BackendSocket } from "../../shared/types"
import {
  createRoom,
  addPlayer,
  removePlayer,
  startRound,
  endRound,
  isRoundActive
} from "../../game/controllers/clientRoomController"
import { makeid } from "../../shared/utils"
import { joinGameResponseCallBack, ClientRoomEmitter } from "../../shared/interfaces"
import Mutations from "../../shared/mutations"

const {
  ROUND_ACTIVE,
  KEY_DOWN,
  KEY_UP,
  PLAYER_DEAD,
} = Mutations

const clientList = new Map()


export function handleNewGame(socket: BackendSocket, name: string, initGameEmitter: ClientRoomEmitter, resFn: any) {
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
  const roomName = clientList.get(socket.id).getRoomName()
  removePlayer(roomName, socket.id)
  clientList.delete(socket.id)
}

export function handleKeyDown(socket: BackendSocket, keyCode: number) {
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
  socket.to(roomName).broadcast.emit("ACTION", { mutation: KEY_DOWN, data: { keyCode, socketId: socket.id } })
}

export function handleKeyUp(socket: BackendSocket, keyCode: number) {
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
  socket.to(roomName).broadcast.emit("ACTION", { mutation: KEY_UP, data: { keyCode, socketId: socket.id } })
}

export function handleStartRound(socket: BackendSocket) {
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

export function handleEndRound(socket: BackendSocket) {
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

export function handleDeadPlayer(socket: BackendSocket, deadPlayerSocketId: string) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).getRoomName()

  if (!isRoundActive(roomName)) {
    return
  }
  socket.to(roomName).broadcast.emit("ACTION", { mutation: PLAYER_DEAD, data: deadPlayerSocketId })
}
