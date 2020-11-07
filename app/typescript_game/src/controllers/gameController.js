import Game from "../classes/Game"
import { FRAME_RATE } from "../constants"
import { GAME_OVER_REASONS } from "../constants"
import levelParams from "../levels"
import {
  GAME_STATE_UPDATE,
  GAME_OVER,
  GAME_ACTIVE,
  ROUND_OVER,
  LOAD_LEVEL,
  COUNTDOWN,
} from "../appEvent"
const MAX_LEVEL = levelParams.length

function createGame(players, context) {
  return Game.createGameState(players, context)
}

function addPlayer(game, player) {
  game.addPlayer(player)
  return game.getPlayerList()
}

function removePlayer(game, socketId) {
  game.removePlayer(socketId)
  return game.getPlayerList()
}

function handleDeadPlayer(game, socketId) {
  game.destroyShip(socketId)
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

async function handleStartRound(game, sequence) {
  if (game.isRoundActive()) {
    return
  }

  let level = game.getCurrentLevel()
  if (level >= MAX_LEVEL) {
    console.log('end game')
    return
  }
  level = levelParams[level]
  console.log(level)
  game.addLevel(level)
  const initialGameState = game.getGameState()
  game.commit(LOAD_LEVEL, { level, initialGameState })
  //await initiateCountdown(game)
  startGameInterval(game, sequence)
}

function initiateCountdown(game) {
  return new Promise((resolve) => {
    let count = 5
    const countdownIntervalId = setInterval(
      function () {
        if (count) {
          game.commit(COUNTDOWN, `<h1>${count--}</h1>`)
        } else {
          clearInterval(countdownIntervalId)
          resolve()
        }
      },
      1000
    )
  })
}

function startGameInterval(game, sequence) {
  if (game.isRoundActive()) {
    return
  }

  const { asteroidField, players, levels } = game
  const { numOfAsteroids, asteroidFieldTimeInterval } = levels[
    levels.length - 1
  ]
  if (sequence) {
    asteroidField.setSequence(sequence)
  }
  game.commit(GAME_ACTIVE, true)
  game.setRoundStatus(true)

  const mainGameLoopIntervalId = setInterval(() => {
    const gameOverReason = game.gameLoop()
    if (!gameOverReason) {
      game.commit(GAME_STATE_UPDATE, game.getGameState())
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
  }, 150)
}

function processGameOver(gameOverReason, game) {
  if (!gameOverReason || !game) {
    return
  }

  game.setRoundStatus(false)
  game.endRound()
  game.dispatch("endRound")
  game.commit(GAME_ACTIVE, false)

  const currentLevel = game.getCurrentLevel()
  if (currentLevel < MAX_LEVEL) {
    const rawHtml = generateGameInfoRawHtml(gameOverReason)
    game.commit(ROUND_OVER, rawHtml)
  } else {
    game.commit(GAME_OVER,
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

module.exports = {
  createGame,
  addPlayer,
  removePlayer,
  gameHandleKeyDown,
  gameHandleKeyUp,
  handleStartRound,
  handleDeadPlayer,
}
