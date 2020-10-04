const io = require("socket.io")()
const Game = require("./classes/Game")
const Client = require("./classes/Client")
const { FRAME_RATE, GAME_OVER_REASONS } = require("./constants")
const { makeid } = require("./utils")
const {
  createNewGame,
  joinGame,
  handleKeydown,
  handleKeyUp,
  processDisconnect,
} = require("./controllers")
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

const gameStates = new Map()
const clientList = new Map()

io.on("connection", (socket) => {
  socket.on(NEW_GAME, handleNewGame)
  socket.on(START_GAME, handleStartGame)
  socket.on(JOIN_GAME, handleJoinRoom)
  socket.on(KEY_DOWN, (keyCode) => handleKeydown(socket.id, keyCode))
  socket.on(KEY_UP, (keyCode) => handleKeyUp(socket.id, keyCode))
  socket.on(DISCONNECT, handleDisconnect)

  function handleStartGame() {
    if (!clientList.has(socket.id)) {
      return
    }
    const client = clientList.get(socket.id)

    if (!client.host) {
      return
    }
    const roomName = client.getRoomName()

    console.log(gameStates.get(roomName))
    io.sockets.in(roomName).emit(GAME_ACTIVE, true)
    startGameInterval(roomName)
  }

  function handleNewGame(name) {
    const client = createNewGame(socket.id, name)

    socket.number = client.playerNumber
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

      const [client, clientList] = joinGame(socket.id, roomName, name, numClients)

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
})

function startGameInterval(roomName) {
  const gameState = gameStates.get(roomName)
  const { asteroidField, players, levels } = gameState
  const { numOfAsteroids, asteroidFieldTimeInterval } = levels[
    levels.length - 1
  ]

  const mainGameLoopIntervalId = setInterval(() => {
    const gameOver = gameState.gameLoop()
    if (!gameOver) {
      emitGameState(roomName, gameState.getGameState())
    } else {
      emitGameOver(roomName, gameOver)
      clearInterval(mainGameLoopIntervalId)
      clearInterval(asteroidFieldIntervalId)
      clearInterval(fireMissileIntervalId)
    }
  }, 1000 / FRAME_RATE)

  const asteroidFieldIntervalId = setInterval(() => {
    asteroidField.generateAsteroid(numOfAsteroids)
  }, asteroidFieldTimeInterval)

  const fireMissileIntervalId = setInterval(() => {
    Object.values(players).forEach((player) => {
      if (player.isAlive) {
        player.fireMissile()
      }
    })
  }, 300)
}

function emitGameState(room, gameState) {
  io.sockets.in(room).emit(GAME_STATE_UPDATE, JSON.stringify(gameState))
}

function emitGameOver(room, reason) {
  io.sockets.in(room).emit(GAME_OVER, GAME_OVER_REASONS[reason])
  io.sockets.in(room).emit(CLEAR_CANVAS)
}

function getAllClientsInRoom(room) {
  const players = []
  clientList.forEach((client) => {
    if (client.roomName === room) {
      players.push(client)
    }
  })

  return players
}

io.listen(3000)
