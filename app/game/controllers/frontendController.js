const Game = require("../classes/GameFrontend")
const { FRAME_RATE } = require("../constants")
const { GAME_OVER_REASONS } = require("../constants")
const levelParams = require("../levels")
const MAX_LEVEL = levelParams.length
const {
  GAME_STATE_UPDATE,
  GAME_OVER,
  GAME_ACTIVE,
  ROUND_OVER,
  PLAYER_ADDED,
  PLAYER_REMOVED,
  LOAD_LEVEL,
  COUNTDOWN
} = require("../events")

function createGame(players, emit) {
  return Game.createGameState(players, emit)
}

function addPlayer(game, player) {
  game.addPlayer(player)
  return game.getPlayerList()
}

function removePlayer(game, socketId) {
  game.removePlayer(socketId)
  return game.getPlayerList()
}

function gameHandleKeyDown(game, keyCode, socketId) {
  const player = game.players[socketId]

  if (!player) {
    return
  }

  player.keys.updateKeysDown(keyCode)
  player.updateVelocityKeyDown(keyCode)
}

function gameHandleKeyUp(game, keyCode, socketId) {
  const player = game.players[socketId]

  if (!player) {
    return
  }

  player.keys.updateKeysUp(keyCode)
  player.updateVelocityKeyUp(keyCode)
}

async function handleStartRound(game) {
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
  game.endRound()
  game.emit(GAME_ACTIVE, false)

  const currentLevel = game.getCurrentLevel()
  if (currentLevel < MAX_LEVEL) {
    const rawHtml = generateGameInfoRawHtml(gameOverReason)
    game.emit(ROUND_OVER, rawHtml)
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
  handleStartRound,
  isRoundActive
}
