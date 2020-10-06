const Game = require("../classes/Game")
const { FRAME_RATE } = require("../constants")
const { GAME_OVER_REASONS } = require("../constants")
const {
  GAME_STATE_UPDATE,
  GAME_OVER,
  GAME_ACTIVE,
  CLEAR_CANVAS,
} = require("../events")

const gameStates = new Map()

function initGame(roomName, client) {
  gameStates.set(roomName, Game.createGameState(client))
}

function addPlayer(roomName, client) {
  const startPosition = { x: client.playerNumber * 200, y: 500 }
  gameStates.get(roomName).addPlayer(client, startPosition)
}

function gameHandleKeyDown(client, keyCode) {
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

function startGameInterval(roomName, initEmitter) {
  const emit = initEmitter(roomName)
  const gameState = gameStates.get(roomName)
  const { asteroidField, players, levels } = gameState
  const { numOfAsteroids, asteroidFieldTimeInterval } = levels[
    levels.length - 1
  ]

  emit(GAME_ACTIVE, true)

  const mainGameLoopIntervalId = setInterval(() => {
    const gameOverReason = gameState.gameLoop()
    if (!gameOverReason) {
      emit(GAME_STATE_UPDATE, gameState.getGameState())
    } else {
      emit(GAME_OVER, GAME_OVER_REASONS[gameOverReason])
      emit(CLEAR_CANVAS)
      clearInterval(mainGameLoopIntervalId)
      clearInterval(asteroidFieldIntervalId)
      clearInterval(fireMissileIntervalId)
      clearInterval(gameTimerIntervalId)
    }
  }, 1000 / FRAME_RATE)

  const gameTimerIntervalId = setInterval(
    () => gameState.decrementTimer(),
    1000
  )

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
  gameHandleKeyDown,
  gameHandleKeyUp,
  startGameInterval,
}
