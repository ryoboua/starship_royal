const Game = require("../classes/Game")
const { FRAME_RATE } = require("../constants")
const { GAME_OVER_REASONS } = require("../constants")
const levelParams = require("../levels")
const MAX_LEVEL = levelParams.length
const {
  GAME_STATE_UPDATE,
  GAME_OVER,
  GAME_ACTIVE,
  CLEAR_CANVAS,
  ROUND_OVER,
  PLAYER_ADDED,
  PLAYER_REMOVED,
  LOAD_LEVEL,
  COUNTDOWN
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
  if (!gameStates.has(roomName)) {
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

async function startRound(roomName) {
  const game = gameStates.get(roomName)

  if (game.isRoundActive()) {
    return
  }

  let level = game.getCurrentLevel()
  if (level >= MAX_LEVEL) {
    console.log('end game')
    return
  }
  level = levelParams[level]
  game.addLevel(level)
  const initialGameState = game.getGameState()
  game.emit(LOAD_LEVEL, { level, initialGameState })
  await initiateCountdown(game)
  startGameInterval(game)
}

function initiateCountdown(game) {
  return new Promise((resolve) => {
    let count = 5
    const countdownIntervalId = setInterval(
      function () {
        if (count) {
          game.emit(COUNTDOWN, `<h1>${count--}</h1>`)
        } else {
          clearInterval(countdownIntervalId)
          resolve()
        }
      },
      1000
    )
  })
}

function startGameInterval(game) {
  if (game.isRoundActive()) {
    return
  }

  const { asteroidField, players, levels } = game
  const { numOfAsteroids, asteroidFieldTimeInterval } = levels[
    levels.length - 1
  ]

  game.setRoundStatus(true)
  game.emit(GAME_ACTIVE, true)

  const mainGameLoopIntervalId = setInterval(() => {
    const gameOverReason = game.gameLoop()
    if (!gameOverReason) {
      game.emit(GAME_STATE_UPDATE, game.getGameState())
    } else {
      clearInterval(mainGameLoopIntervalId)
      clearInterval(asteroidFieldIntervalId)
      clearInterval(fireMissileIntervalId)
      clearInterval(gameTimerIntervalId)

      processGameOver(gameOverReason, game)
    }
  }, 1000 / FRAME_RATE)

  const gameTimerIntervalId = setInterval(
    () => game.decrementTimer(),
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

function processGameOver(gameOverReason, game) {
  if (!gameOverReason || !game) {
    return
  }

  game.setRoundStatus(false)
  game.emit(GAME_ACTIVE, false)

  const rawHtml = generateGameInfoRawHtml(gameOverReason)

  game.endRound()

  const currentLevel = game.getCurrentLevel()
  if (currentLevel < MAX_LEVEL) {
    game.emit(ROUND_OVER, rawHtml)
    game.emit(CLEAR_CANVAS)
  } else {
    game.emit(GAME_OVER,
      `
      <h1>GAME OVER</h1>
      <br>
      <h1>THANKS FOR PLAYING</h1>
    `)
  }

}

function generateGameInfoRawHtml(reason) {
  return `<h1>${GAME_OVER_REASONS[reason]}</h1>`
}

function isRoundActive(roomName) {
  if (!gameStates.has(roomName)) {
    return
  }

  return gameStates.get(roomName).isRoundActive()
}

module.exports = {
  createGame,
  addPlayer,
  removePlayer,
  gameHandleKeyDown,
  gameHandleKeyUp,
  startRound,
  isRoundActive
}
