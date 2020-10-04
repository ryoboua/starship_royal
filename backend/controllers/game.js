const Game = require("../classes/Game")
const { FRAME_RATE } = require("../constants")

const gameStates = new Map()

function initGame(roomName, client) {
  gameStates.set(roomName, Game.createGameState(client))
}

function addPlayer(roomName, client) {
  const startPosition = { x: client.playerNumber * 200, y: 500 }
  gameStates.get(roomName).addPlayer(client, startPosition)
}

function gamehandleKeyDown(client, keyCode) {
  const player = gameStates.get(client.roomName).players[client.socketId]

  if (!player) {
    return
  }

  player.keys.updateKeysDown(keyCode)
  player.updateVelocityKeyDown(keyCode)
}

function gameHandleKeyUp(client, keyCode) {
  const player = gameStates.get(client.roomName).players[client.socketId]

  if (!player) {
    return
  }

  player.keys.updateKeysUp(keyCode)
  player.updateVelocityKeyUp(keyCode)
}

function startGameInterval(
  roomName,
  { emitGameActive, emitGameState, emitGameOver }
) {
  const gameState = gameStates.get(roomName)
  const { asteroidField, players, levels } = gameState
  const { numOfAsteroids, asteroidFieldTimeInterval } = levels[
    levels.length - 1
  ]

  emitGameActive(roomName)

  const mainGameLoopIntervalId = setInterval(() => {
    const gameOverReason = gameState.gameLoop()
    if (!gameOverReason) {
      emitGameState(roomName, gameState.getGameState())
    } else {
      emitGameOver(roomName, gameOverReason)
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

module.exports = {
  initGame,
  addPlayer,
  gamehandleKeyDown,
  gameHandleKeyUp,
  startGameInterval,
}
