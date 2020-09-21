const io = require("socket.io")()
const { createGameState, gameloop } = require("./game")
const { FRAME_RATE } = require("./constants")
const { makeid } = require("./utils")

const state = {}
const clientRooms = {}

io.on("connection", (client) => {
  client.on("newGame", handleNewGame)
  client.on("joinGame", handleJoinGame)
  client.on("startGame", handleStartGame)

  // client.on("keydown", handleKeydown)
  // client.on("keyup", handleKeyUp)

  function handleStartGame() {
    console.log("ysdsa")
  }

  function handleNewGame() {
    const roomName = makeid(5)
    const playerNumber = 1

    clientRooms[client.id] = roomName
    state[roomName] = createGameState()

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

    clientRooms[client.id] = roomName
    client.join(roomName)
    client.number = playerNumber
    client.emit("JOIN_GAME_ACCEPTED", {
      roomName,
      playerNumber,
    })
    //room.emit("PLAYER_JOINED", {})
    //startGameInterval(roomName);
  }

  function handleKeydown(keyCode) {
    try {
      keyCode = parseInt(keyCode)
    } catch (e) {
      console.log(e)
      return
    }

    if (keyCode === 67) {
    }
    player.keys.updateKeysDown(keyCode)
    player.updateVelocityKeyDown(keyCode)
  }

  function handleKeyUp(keyCode) {
    try {
      keyCode = parseInt(keyCode)
    } catch (e) {
      console.log(e)
      return
    }

    player.keys.updateKeysUp(keyCode)
    player.updateVelocityKeyUp(keyCode)
  }
})

function startGameInterval(client, state) {
  const mainGameLoopIntervalId = setInterval(() => {
    const winner = gameloop(state)
    if (!winner) {
      //console.log(state.player.keys)
      client.emit("gameState", JSON.stringify(state))
    } else {
      client.emit("gameOver")
      clearInterval(mainGameLoopIntervalId)
      clearInterval(asteroidFieldIntervalId)
      clearInterval(fireMissileIntervalId)
    }
  }, 1000 / FRAME_RATE)

  const asteroidFieldIntervalId = setInterval(() => {
    state.asteroidField.generateAsteroid(3)
  }, 100)

  const fireMissileIntervalId = setInterval(() => {
    state.player.fireMissile()
  }, 300)
}

io.listen(3000)
