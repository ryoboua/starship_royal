const Game = require("../classes/Game")
const { FRAME_RATE } = require("../constants")
const { GAME_OVER_REASONS } = require("../constants")
const {
  GAME_STATE_UPDATE,
  GAME_OVER,
  GAME_ACTIVE,
  CLEAR_CANVAS,
  ROUND_OVER,
  PLAYER_ADDED,
  PLAYER_REMOVED
} = require("../events")

const gameStates = new Map()

function createGame(roomName, client, emit) {
  gameStates.set(roomName, Game.createGameState(client, emit))
}

function addPlayer(roomName, client) {
  const game = gameStates.get(roomName)
  game.addPlayer(client)
  game.emit(PLAYER_ADDED, game.getPlayerList())
}

function removePlayer(roomName, socketId) {
  if(!gameStates.has(roomName)) {
    return
  }
  
  const game = gameStates.get(roomName)
  game.removePlayer(socketId)
  game.emit(PLAYER_REMOVED, game.getPlayerList())
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

function startGameInterval(roomName) {
  const gameState = gameStates.get(roomName)

  if(gameState.isRoundActive()) {
    return
  }

  const { asteroidField, players, levels, emit,  } = gameState
  const { numOfAsteroids, asteroidFieldTimeInterval } = levels[
    levels.length - 1
  ]
  gameState.setRoundStatus(true)
  emit(GAME_ACTIVE, true)
  const mainGameLoopIntervalId = setInterval(() => {
    const gameOverReason = gameState.gameLoop()
    if (!gameOverReason) {
      emit(GAME_STATE_UPDATE, gameState.getGameState())
    } else {
      clearInterval(mainGameLoopIntervalId)
      clearInterval(asteroidFieldIntervalId)
      clearInterval(fireMissileIntervalId)
      clearInterval(gameTimerIntervalId)
      gameState.setRoundStatus(false)
      emit(GAME_ACTIVE, false)

      const modal = generateModal(gameOverReason)
      const nextLevel = gameState.endRound()
      if(nextLevel) {
        emit(ROUND_OVER, modal)
        emit(CLEAR_CANVAS)
      } else {
        emit(GAME_OVER, modal)
      }
 
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

function generateModal(reason) {
  return { header: "GAME OVER", body: GAME_OVER_REASONS[reason]}
}

function emitToRoom(roomName, eventName, data=null) {
  if(!gameStates.has(roomName)) {
    return
  }

  gameStates.get(roomName).emit(eventName)
}

module.exports = {
  createGame,
  addPlayer,
  removePlayer,
  gameHandleKeyDown,
  gameHandleKeyUp,
  startGameInterval,
  emitToRoom
}
