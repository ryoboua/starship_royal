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
} from "./controllers/clientController.js"

import Mutations from "../mutations"

const {
  CREATE_GAME,
  START_ROUND,
  JOIN_GAME,
  KEY_DOWN,
  KEY_UP,
  DISCONNECT,
  PLAYER_DEAD,
  END_ROUND
} = Mutations

const io = socketIO()

io.serveClient(false);
io.listen(3000)


function initGameEmitter(roomName: string) {
  return (commit: any) =>
    io.sockets.in(roomName).emit("ACTION", commit)
}

io.on("connection", (socket) => {
  socket.on(CREATE_GAME, (name, resFn) => handleNewGame(socket, name, initGameEmitter, resFn))
  socket.on(JOIN_GAME, handleJoinRoom)
  socket.on(START_ROUND, () => handleStartRound(socket))
  socket.on(END_ROUND, () => handleEndRound(socket))
  socket.on(DISCONNECT, () => handleDisconnect(socket))
  socket.on(KEY_DOWN, (keyCode) => handleKeyDown(socket, keyCode))
  socket.on(KEY_UP, (keyCode) => handleKeyUp(socket, keyCode))
  socket.on(PLAYER_DEAD, (deadPlayerSocketId) => handleDeadPlayer(socket, deadPlayerSocketId))

  function handleJoinRoom({ roomName, name }: { roomName: string, name: string }, resFn: any): void {
    const room = io.sockets.adapter.rooms[roomName]

    let allUsers
    if (room) {
      allUsers = room.sockets
    }

    let numClients = 0
    if (allUsers) {
      numClients = Object.keys(allUsers).length
    }

    if (numClients === 0) {
      const err = {
        header: "Unknown Room",
        body: `Unable to find room ${roomName}`,
      }
      return resFn(null, err)
    } else if (numClients >= 4) {
      const err = {
        header: `Room is full`,
        body: `Room ${roomName} is full. Maximum of 4 players per room`,
      }
      return resFn(null, err)
    }

    joinRoom(socket, roomName, name, numClients, resFn)
  }
})

