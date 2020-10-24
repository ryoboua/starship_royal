const io = require("socket.io")()
io.serveClient(false);
io.listen(3000)

const {
  handleNewGame,
  joinRoom,
  handleKeyDown,
  handleKeyUp,
  handleDisconnect,
  handleStartRound,
  handleEndRound,
  handleDeadPlayer,
} = require("./controllers/clientController")
const {
  NEW_GAME,
  START_ROUND,
  JOIN_GAME,
  KEY_DOWN,
  KEY_UP,
  UNKNOWN_CODE,
  TOO_MANY_PLAYERS,
  DISCONNECT,
  PLAYER_DEAD,
  END_ROUND
} = require("../appEvent")

function initGameEmitter(roomName) {
  return (eventName, data = null) =>
    io.sockets.in(roomName).emit(eventName, data)
}

io.on("connection", (socket) => {
  socket.on(NEW_GAME, (name) => handleNewGame(socket, name, initGameEmitter))
  socket.on(JOIN_GAME, handleJoinRoom)
  socket.on(START_ROUND, () => handleStartRound(socket))
  socket.on(END_ROUND, () => handleEndRound(socket))
  socket.on(DISCONNECT, () => handleDisconnect(socket))
  socket.on(KEY_DOWN, (keyCode) => handleKeyDown(socket, keyCode))
  socket.on(KEY_UP, (keyCode) => handleKeyUp(socket, keyCode))
  socket.on(PLAYER_DEAD, (deadPlayerSocketId) => handleDeadPlayer(socket, deadPlayerSocketId))

  function handleJoinRoom({ roomName, name }) {
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
      socket.emit(UNKNOWN_CODE, {
        header: "Unknown Room",
        body: `Unable to find room ${roomName}`,
      })
      return
    } else if (numClients >= 4) {
      socket.emit(TOO_MANY_PLAYERS, {
        header: `Room is full`,
        body: `Room ${roomName} is full. Maximum of 4 players per room`,
      })
      return
    }

    joinRoom(socket, roomName, name, numClients)
  }
})

