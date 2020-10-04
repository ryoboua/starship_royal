const io = require("socket.io")()

const { GAME_OVER_REASONS } = require("./constants")
const {
  createNewGame,
  joinRoom,
  handleKeyDown,
  handleKeyUp,
  processDisconnect,
  startGame,
} = require("./controllers/client")
const {
  NEW_GAME,
  START_GAME,
  JOIN_GAME,
  JOIN_GAME_ACCEPTED,
  KEY_DOWN,
  KEY_UP,
  UNKNOWN_CODE,
  TOO_MANY_PLAYERS,
  GAME_STATE_UPDATE,
  GAME_OVER,
  GAME_ACTIVE,
  CLEAR_CANVAS,
  PLAYER_ADDED,
  PLAYER_REMOVED,
  DISCONNECT,
} = require("./events")


io.on("connection", (socket) => {
  socket.on(NEW_GAME, handleNewGame)
  socket.on(JOIN_GAME, handleJoinRoom)
  socket.on(START_GAME, handleStartGame)
  socket.on(DISCONNECT, handleDisconnect)
  socket.on(KEY_DOWN, (keyCode) => handleKeyDown(socket.id, keyCode))
  socket.on(KEY_UP, (keyCode) => handleKeyUp(socket.id, keyCode))

  function handleNewGame(name) {
    const client = createNewGame(socket.id, name)

    socket.join(client.roomName)
    socket.emit(NEW_GAME, client)
  }

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
      socket.emit(UNKNOWN_CODE)
      return
    } else if (numClients >= 4) {
      socket.emit(TOO_MANY_PLAYERS)
      return
    }

    socket.join(roomName, (err) => {
      if (err) {
        return console.log(`Error trying to join room ${roomName}`)
      }

      const [client, clientList] = joinRoom(
        socket.id,
        roomName,
        name,
        numClients
      )

      socket.emit(JOIN_GAME_ACCEPTED, client)
      io.sockets.in(roomName).emit(PLAYER_ADDED, clientList)
    })
  }

  function handleDisconnect() {
    const res = processDisconnect(socket.id)
    if (!res) {
      return
    }

    const [roomName, newClientList] = res
    io.sockets.in(roomName).emit(PLAYER_REMOVED, newClientList)
  }

  function handleStartGame() {
    startGame(socket.id, { emitGameActive, emitGameState, emitGameOver })
  
    function emitGameState(room, gameState) {
      io.sockets.in(room).emit(GAME_STATE_UPDATE, JSON.stringify(gameState))
    }
  
    function emitGameOver(room, reason) {
      io.sockets.in(room).emit(GAME_OVER, GAME_OVER_REASONS[reason])
      io.sockets.in(room).emit(CLEAR_CANVAS)
    }
  
    function emitGameActive(roomName) {
      io.sockets.in(roomName).emit(GAME_ACTIVE, true)
    }
  }
})



io.listen(3000)
