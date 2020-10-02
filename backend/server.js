const io = require("socket.io")()
const Game = require("./classes/Game")
const Client = require("./classes/Client")
const { FRAME_RATE, GAME_OVER_REASONS } = require("./constants")
const { makeid } = require("./utils")
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
  socket.on(JOIN_GAME, handleJoinGame)
  socket.on(KEY_DOWN, handleKeydown)
  socket.on(KEY_UP, handleKeyUp)
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
    const roomName = makeid(5)
    const playerNumber = 1
    socket.number = playerNumber
    socket.join(roomName, (err) => {
      if (err) {
        return console.log("Error creating new game")
      }

      const client = new Client(socket.id, name, roomName, playerNumber, true)
      clientList.set(socket.id, client)
      gameStates.set(roomName, Game.createGameState(client))

      socket.emit(NEW_GAME, client)
    })
  }

  function handleJoinGame({ roomName, name }) {
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

      const playerNumber = numClients + 1
      socket.number = playerNumber

      const client = new Client(socket.id, name, roomName, playerNumber)
      clientList.set(socket.id, client)

      const startPosition = { x: playerNumber * 200, y: 500 }
      gameStates.get(roomName).addPlayer(client, startPosition)

      socket.emit(JOIN_GAME_ACCEPTED, client)
      io.sockets.in(roomName).emit(PLAYER_ADDED, getAllClientsInRoom(roomName))
    })
  }

  function handleKeydown(keyCode) {
    if (!clientList.has(socket.id)) {
      return
    }

    const roomName = clientList.get(socket.id).getRoomName()

    try {
      keyCode = parseInt(keyCode)
    } catch (e) {
      console.log(e)
      return
    }
    const player = gameStates.get(roomName).players[socket.number - 1]

    if (!player) {
      return
    }

    player.keys.updateKeysDown(keyCode)
    player.updateVelocityKeyDown(keyCode)
  }

  function handleKeyUp(keyCode) {
    if (!clientList.has(socket.id)) {
      return
    }

    const roomName = clientList.get(socket.id).getRoomName()

    try {
      keyCode = parseInt(keyCode)
    } catch (e) {
      console.log(e)
      return
    }

    const player = gameStates.get(roomName).players[socket.number - 1]

    if (!player) {
      return
    }

    player.keys.updateKeysUp(keyCode)
    player.updateVelocityKeyUp(keyCode)
  }

  function handleDisconnect() {
    if (!clientList.has(socket.id)) {
      return
    }
    const roomName = clientList.get(socket.id).getRoomName()
    clientList.delete(socket.id)
    io.sockets.in(roomName).emit(PLAYER_REMOVED, getAllClientsInRoom(roomName))
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
    players.forEach((player) => {
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
