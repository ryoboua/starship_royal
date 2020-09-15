const io = require("socket.io")()
const { createGameState, gameloop } = require("./game")
const { FRAME_RATE } = require("./constants")

io.on("connection", (client) => {
  const state = createGameState()
  startGameInterval(client, state)

  const { player, asteroidField } = state

  client.on("keydown", handleKeydown)
  client.on("keyup", handleKeyUp)

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
      clearInterval(intervalId)
      clearInterval(asteroidFieldIntervalId)
      clearInterval(fireMissileIntervalId)
    }
  }, 1000 / FRAME_RATE)

  const asteroidFieldIntervalId = setInterval(() => {
    state.asteroidField.generateAsteroid(3)
  }, 1000)

  const fireMissileIntervalId = setInterval(() => {
    state.player.fireMissile()
  }, 350)
}

io.listen(3000)
