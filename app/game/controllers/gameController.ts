import Game from "../classes/Game"
import { FRAME_RATE } from "../constants"
import levelParams from "../levels"
import { ClientModel, Level, GameActionContext, KeyEvent } from "../../shared/interfaces"
import { Sequence } from "../../shared/types"
import Mutations from "../../shared/mutations"

const {
  GAME_STATE_UPDATE,
  GAME_OVER,
  GAME_ACTIVE,
  ROUND_OVER,
  LOAD_LEVEL,
  COUNTDOWN,
} = Mutations

const MAX_LEVEL = levelParams.length

export function createGame(players: Array<ClientModel>, context: GameActionContext) {
  return Game.createGameState(players, context)
}

export function addPlayer(game: Game, player: ClientModel) {
  game.addPlayer(player)
  return game.getPlayerList()
}

export function removePlayer(game: Game, socketId: string) {
  game.removePlayer(socketId)
  return game.getPlayerList()
}

export function handleDeadPlayer(game: Game, socketId: string) {
  game.destroyShip(socketId)
}

export function gameHandleKeyDown(game: Game, keyEvent: KeyEvent) {
  const { socketId, keyCode, pos } = keyEvent
  const player = game.players[socketId]

  if (!player) {
    return
  }

  player.keys.updateKeysDown(keyCode)
  player.updateVelocityKeyDown(keyCode)

  // if (!game.isLocal(socketId) && pos) {
  //   player.pos = pos
  // }
}

export function gameHandleKeyUp(game: Game, keyEvent: KeyEvent) {
  const { socketId, keyCode, pos } = keyEvent
  const player = game.players[socketId]

  if (!player) {
    return
  }

  player.keys.updateKeysUp(keyCode)
  player.updateVelocityKeyUp(keyCode)

  if (!game.isLocal(socketId) && pos) {
    player.pos = pos
  }
}

export async function handleStartRound(game: Game, sequence: Sequence) {
  if (game.roundActive) {
    return
  }

  // let level: number | Level = game.getCurrentLevel()
  // if (level >= MAX_LEVEL) {
  //   console.log('end game')
  //   return
  // }
  const level = levelParams[0]
  level.number = ++game.level
  game.addLevel(level)
  const initialGameState = game.getGameState()
  game.commit(LOAD_LEVEL, { level, initialGameState })
  //await initiateCountdown(game)
  startGameInterval(game, sequence)
}

function initiateCountdown(game: Game) {
  return new Promise((resolve) => {
    let count = 3
    const countdownIntervalId = setInterval(
      function () {
        if (count) {
          game.commit(COUNTDOWN, { msg: `${count--}` })
        } else {
          clearInterval(countdownIntervalId)
          resolve()
        }
      },
      1000
    )
  })
}

function startGameInterval(game: Game, sequence: Sequence) {
  if (game.roundActive) {
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

function processGameOver(gameOverReason: number, game: Game) {
  if (!gameOverReason || !game) {
    return
  }

  game.setRoundStatus(false)
  game.resetState()
  game.dispatch("emitEndRoundToBackend")
  game.commit(GAME_ACTIVE, false)

  const winner = game.getPlayerWithHighestScore()
  //const currentLevel = game.getCurrentLevel()

  const payload = { reason: gameOverReason, winner }
  game.dispatch("roundOver", payload)

  // if (currentLevel < MAX_LEVEL) {
  //   game.dispatch("roundOver", payload)
  // } else {
  //   game.commit(GAME_OVER, payload)
  // }

}