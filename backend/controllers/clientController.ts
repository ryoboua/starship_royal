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
import { joinGameResponseCallBack, ClientRoomEmitter, KeyEvent, PlayerPositionUpdate } from "../../shared/interfaces"
import { SHIP_COLOURS } from "../../game/constants";

const clientList = new Map()

export function handleNewGame(socket: BackendSocket, name: string, initGameEmitter: ClientRoomEmitter, joinGameResponse: any) {
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
      color: SHIP_COLOURS[playerNumber - 1]
    })

    clientList.set(client.socketId, client)
    createRoom(roomName, [client], initGameEmitter(roomName))
    joinGameResponse(client)
  })
}

export function joinRoom(socket: BackendSocket, roomName: string, name: string, numClients: number, joinGameResponse: joinGameResponseCallBack) {
  if (isRoundActive(roomName)) {
    const err = {
      header: `Unable to join while round active`,
      body: "",
    }
    return joinGameResponse(null, err)
  }
  socket.join(roomName, (err) => {
    if (err) {
      return joinGameResponse(null, {
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
      host: false,
      color: SHIP_COLOURS[playerNumber - 1]
    })

    clientList.set(client.socketId, client)
    addPlayer(roomName, client, socket, joinGameResponse)
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

export function handleKeyDown(socket: BackendSocket, keyEvent: KeyEvent) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).roomName

  if (!isRoundActive(roomName)) {
    return
  }

  socket.to(roomName).broadcast.emit("keydown", keyEvent)
}

export function handleKeyUp(socket: BackendSocket, keyEvent: KeyEvent) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).roomName

  if (!isRoundActive(roomName)) {
    return
  }

  socket.to(roomName).broadcast.emit("keyup", keyEvent)
}

export function handlePlayerPositionUpdate(socket: BackendSocket, update: PlayerPositionUpdate) {
  if (!clientList.has(socket.id)) {
    return
  }

  const roomName = clientList.get(socket.id).roomName

  if (!isRoundActive(roomName)) {
    return
  }

  socket.to(roomName).broadcast.emit("playerPositionUpdate", update)
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
