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
    asteroidField.generateAsteroid(3)
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
