import socketIO from "socket.io"
import {
  handleNewGame,
  joinRoom,
  handleKeyDown,
  handleKeyUp,
  handleDisconnect,
  handleStartRound,
  handleEndRound,
  handleDeadPlayer,
  handlePlayerPositionUpdate
} from "./controllers/clientController.js"

import { joinGameResponseCallBack, ClientRoomEmitter } from "../shared/interfaces"
import Mutations from "../shared/mutations"

const {
  CREATE_GAME,
  START_ROUND,
  JOIN_GAME,
  KEY_DOWN,
  KEY_UP,
  DISCONNECT,
  PLAYER_DEAD,
  END_ROUND,
  PLAYER_POSITION_UPDATE
} = Mutations

const io = socketIO()

io.serveClient(false);
io.listen(3000)

let initGameEmitter: ClientRoomEmitter

initGameEmitter = function (roomName: string) {
  return function (action: string, payload: any): void {
    io.sockets.in(roomName).emit(action, payload)
  }
}


io.on("connection", (socket) => {
  socket.on(CREATE_GAME, (name, joinGameResponse) => handleNewGame(socket, name, initGameEmitter, joinGameResponse))
  socket.on(JOIN_GAME, handleJoinRoom)
  socket.on(START_ROUND, () => handleStartRound(socket))
  socket.on(END_ROUND, () => handleEndRound(socket))
  socket.on(DISCONNECT, () => handleDisconnect(socket))
  socket.on(KEY_DOWN, (keyCode) => handleKeyDown(socket, keyCode))
  socket.on(KEY_UP, (keyCode) => handleKeyUp(socket, keyCode))
  socket.on(PLAYER_DEAD, (deadPlayerSocketId) => handleDeadPlayer(socket, deadPlayerSocketId))
  socket.on(PLAYER_POSITION_UPDATE, (update) => handlePlayerPositionUpdate(socket, update))

  function handleJoinRoom({ roomName, name }: { roomName: string, name: string }, joinGameResponse: joinGameResponseCallBack): void {
    const room = io.sockets.adapter.rooms[roomName]

    let allClients
    if (room) {
      allClients = room.sockets
    }

    let numClients = 0
    if (allClients) {
      numClients = Object.keys(allClients).length
    }

    if (numClients === 0) {
      const err = {
        header: "Unknown Room",
        body: `Unable to find room ${roomName}`,
      }
      return joinGameResponse(null, err)
    } else if (numClients >= 4) {
      const err = {
        header: `Room is full`,
        body: `Room ${roomName} is full. Maximum of 4 players per room`,
      }
      return joinGameResponse(null, err)
    }

    joinRoom(socket, roomName, name, numClients, joinGameResponse)
  }
})

