const io = require("socket.io")()
const { createGameState, gameloop, addPlayer } = require("./game")
const { FRAME_RATE } = require("./constants")
const { makeid } = require("./utils")

const state = {}
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

    console.log(state[roomName])

    startGameInterval(roomName)
  }

  function handleNewGame() {
    const roomName = makeid(5)
    const playerNumber = 1

    clientRooms[client.id] = roomName
    state[roomName] = createGameState(client.id, playerNumber)

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

    addPlayer(state[roomName], {
      id: client.id,
      playerNumber,
      startPosition: { x: 200, y: 300 },
    })

    clientRooms[client.id] = roomName
    client.number = playerNumber

    client.join(roomName)
    client.emit("JOIN_GAME_ACCEPTED", {
      roomName,
      playerNumber,
    })
    //room.emit("PLAYER_JOINED", {})
    //startGameInterval(roomName);
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
    const player = state[roomName].players[client.number - 1]

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

    const player = state[roomName].players[client.number - 1]

    if (!player) {
      return
    }

    player.keys.updateKeysUp(keyCode)
    player.updateVelocityKeyUp(keyCode)
  }
})

function startGameInterval(roomName) {
  const mainGameLoopIntervalId = setInterval(() => {
    const winner = gameloop(state[roomName])
    if (!winner) {
      //console.log(state.player.keys)
      emitGameState(roomName, state[roomName])
    } else {
      emitGameOver("gameOver")
      clearInterval(mainGameLoopIntervalId)
      clearInterval(asteroidFieldIntervalId)
      clearInterval(fireMissileIntervalId)
    }
  }, 1000 / FRAME_RATE)

  const asteroidFieldIntervalId = setInterval(() => {
    state[roomName].asteroidField.generateAsteroid(3)
  }, 100)

  const fireMissileIntervalId = setInterval(() => {
    state[roomName].players.forEach((player) => {
      player.fireMissile()
    })
  }, 300)
}

function emitGameState(room, gameState) {
  io.sockets.in(room).emit("gameState", JSON.stringify(gameState))
}

function emitGameOver(room, winner) {
  io.sockets.in(room).emit("gameOver")
}

io.listen(3000)
