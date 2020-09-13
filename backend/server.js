const io = require("socket.io")()
const {
  createGameState,
  gameloop,
  getUpdatedVelocityKeyUp,
  getUpdatedVelocityKeyDown,
  getUpdatedKeysUp,
  getUpdatedKeysDown,
} = require("./game")
const { FRAME_RATE } = require("./constants")

io.on("connection", (client) => {
  const state = createGameState()

  startGameInterval(client, state)
  client.on("keydown", handleKeydown)
  client.on("keyup", handleKeyUp)

  function handleKeydown(keyCode) {
    try {
      keyCode = parseInt(keyCode)
    } catch (e) {
      console.log(e)
      return
    }

    const keys = getUpdatedKeysDown(keyCode, state.player.keys)
    if (keys) {
      state.player.keys = keys
    }

    const vel = getUpdatedVelocityKeyDown(
      keyCode,
      state.player.vel,
      state.player.keys
    )
    if (vel) {
      state.player.vel = vel
    }
  }

  function handleKeyUp(keyCode) {
    try {
      keyCode = parseInt(keyCode)
    } catch (e) {
      console.log(e)
      return
    }

    const keys = getUpdatedKeysUp(keyCode, state.player.keys)
    if (keys) {
      state.player.keys = keys
    }

    const vel = getUpdatedVelocityKeyUp(
      keyCode,
      state.player.vel,
      state.player.keys
    )
    if (vel) {
      state.player.vel = vel
    }
  }
})

function startGameInterval(client, state) {
  const intervalId = setInterval(() => {
    const winner = gameloop(state)
    if (!winner) {
      //console.log(state.player.keys)
      client.emit("gameState", JSON.stringify(state))
    } else {
      client.emit("gameOver")
      clearInterval(intervalId)
    }
  }, 10000 / FRAME_RATE)
}

io.listen(3000)
