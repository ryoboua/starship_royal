const io = require("socket.io")()
const Game = require("./classes/Game")
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
} = require("./events")

const gameStates = {}
const clientRooms = {}

io.on("connection", (client) => {
  client.on(NEW_GAME, handleNewGame)
  client.on(START_GAME, handleStartGame)
  client.on(JOIN_GAME, handleJoinGame)
  client.on(KEY_DOWN, handleKeydown)
  client.on(KEY_UP, handleKeyUp)
  client.on("disconnect", function() {
    console.log('I disconnected')
  })

  function handleStartGame() {
    const roomName = clientRooms[client.id].roomName
    if (!roomName) {
      return
    }
    console.log(gameStates[roomName])
    io.sockets.in(roomName).emit(GAME_ACTIVE, true)
    startGameInterval(roomName)
  }

  function handleNewGame(name) {
    const roomName = makeid(5)
    const playerNumber = 1

    clientRooms[client.id] = { roomName, name }
    gameStates[roomName] = Game.createGameState(client.id, playerNumber, name)

    client.number = playerNumber
    client.join(roomName)

    client.emit(NEW_GAME, {
      playerNumber,
      roomName,
      name,
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
      client.emit(UNKNOWN_CODE)
      return
    } else if (numClients >= 4) {
      client.emit(TOO_MANY_PLAYERS)
      return
    }

    const playerNumber = numClients + 1
    const startPosition = { x: playerNumber * 200, y: 500 }
    gameStates[roomName].addPlayer({
      id: client.id,
      playerNumber,
      startPosition,
      name,
    })

    clientRooms[client.id] = { roomName, name }
    client.number = playerNumber

    client.join(roomName, () => {
      client.emit(JOIN_GAME_ACCEPTED, {
        roomName,
        playerNumber,
      })

      io.sockets.in(roomName).emit(PLAYER_ADDED, getAllPlayersInRoom(roomName))
    })
  }

  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id].roomName
    if (!roomName) {
      return
    }

    try {
      keyCode = parseInt(keyCode)
    } catch (e) {
      console.log(e)
      return
    }
    const player = gameStates[roomName].players[client.number - 1]

    if (!player) {
      return
    }

    player.keys.updateKeysDown(keyCode)
    player.updateVelocityKeyDown(keyCode)
  }

  function handleKeyUp(keyCode) {
    const roomName = clientRooms[client.id].roomName
    if (!roomName) {
      return
    }

    try {
      keyCode = parseInt(keyCode)
    } catch (e) {
      console.log(e)
      return
    }

    const player = gameStates[roomName].players[client.number - 1]

    if (!player) {
      return
    }

    player.keys.updateKeysUp(keyCode)
    player.updateVelocityKeyUp(keyCode)
  }
})

function startGameInterval(roomName) {
  const gameState = gameStates[roomName]
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

function getAllPlayersInRoom(room) {
  const players = []
  for (const [clientId, data] of Object.entries(clientRooms)) {
    if (data.roomName === room) {
      players.push(data)
    }
  }

  return players
}

io.listen(3000)
