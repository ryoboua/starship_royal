const io = require("socket.io")()
const Game = require("./classes/Game")
const { FRAME_RATE } = require("./constants")
const { makeid } = require("./utils")

const gameStates = {}
const clientRooms = {}

io.on("connection", (client) => {
  client.on("newGame", handleNewGame)
  client.on("joinGame", handleJoinGame)
  client.on("startGame", handleStartGame)

  client.on("keydown", handleKeydown)
  client.on("keyup", handleKeyUp)

  function handleStartGame() {
    const roomName = clientRooms[client.id]
    if (!roomName) {
      return
    }
    console.log(gameStates[roomName])
    startGameInterval(roomName)
  }

  function handleNewGame() {
    const roomName = makeid(5)
    const playerNumber = 1

    clientRooms[client.id] = roomName
    gameStates[roomName] = Game.createGameState(client.id, playerNumber)

    client.number = playerNumber
    client.join(roomName)

    client.emit("NEW_GAME", {
      playerNumber,
      roomName,
    })
  }

  function handleJoinGame(roomName) {
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
      client.emit("unknownCode")
      return
    } else if (numClients >= 4) {
      client.emit("tooManyPlayers")
      return
    }

    const playerNumber = numClients + 1
    const startPosition = { x: playerNumber * 200, y: 500 }
    gameStates[roomName].addPlayer({
      playerNumber,
      startPosition,
    })

    clientRooms[client.id] = roomName
    client.number = playerNumber

    client.join(roomName)
    client.emit("JOIN_GAME_ACCEPTED", {
      roomName,
      playerNumber,
    })
    //room.emit("PLAYER_JOINED", {})
  }

  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id]
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
    const roomName = clientRooms[client.id]
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
  const mainGameLoopIntervalId = setInterval(() => {
    const winner = gameStates[roomName].gameloop()
    if (!winner) {
      emitGameState(roomName, gameStates[roomName].getGameState())
    } else {
      emitGameOver("gameOver")
      clearInterval(mainGameLoopIntervalId)
      clearInterval(asteroidFieldIntervalId)
      clearInterval(fireMissileIntervalId)
    }
  }, 1000 / FRAME_RATE)

  const asteroidFieldIntervalId = setInterval(() => {
    gameStates[roomName].asteroidField.generateAsteroid(3)
  }, 100)

  const fireMissileIntervalId = setInterval(() => {
    gameStates[roomName].players.forEach((player) => {
      player.fireMissile()
    })
  }, 300)
}

function emitGameState(room, gameState) {
  io.sockets.in(room).emit("GAME_STATE_UPDATE", JSON.stringify(gameState))
}

function emitGameOver(room, winner) {
  io.sockets.in(room).emit("GAME_OVER")
}

io.listen(3000)
