import Game from "../classes/Game"
import { FRAME_RATE } from "../constants"
import levelParams from "../levels"
import { ClientModel, GameActionContext, KeyEvent, PlayerPositionUpdate } from "../../shared/interfaces"
import { Sequence } from "../../shared/types"
import Mutations from "../../shared/mutations"

const {
  GAME_STATE_UPDATE,
  GAME_ACTIVE,
  LOAD_LEVEL,
  COUNTDOWN,
} = Mutations

export function createGame(players: ClientModel[], context: GameActionContext) {
  return Game.createGameState(players, context)
}

export function addPlayer(game: Game, player: ClientModel) {
  game.addPlayer(player)
  return game.playerList
}

export function removePlayer(game: Game, socketId: string) {
  game.removePlayer(socketId)
  return game.playerList
}

export function handleDeadPlayer(game: Game, socketId: string) {
  game.destroyShip(socketId)
}

export function handlePlayerPositionUpdate(game: Game, update: PlayerPositionUpdate) {
  const { socketId, pos } = update
  const player = game.players[socketId]

  if (!player) {
    return
  }
  player.pos = pos
}

export function gameHandleKeyDown(game: Game, keyEvent: KeyEvent) {
  const { socketId, keyCode, pos } = keyEvent
  const player = game.players[socketId]

  if (!player) {
    return
  }

  if (pos) {
    player.pos = pos
  }

  player.keys.updateKeysDown(keyCode)
  player.updateVelocityKeyDown(keyCode)
}

export function gameHandleKeyUp(game: Game, keyEvent: KeyEvent) {
  const { socketId, keyCode } = keyEvent
  const player = game.players[socketId]

  if (!player) {
    return
  }

  player.keys.updateKeysUp(keyCode)
  player.updateVelocityKeyUp(keyCode)
}

export async function handleStartRound(game: Game, sequence: Sequence) {
  if (game.roundActive) {
    return
  }

  const level = levelParams[0]
  game.addLevel(level)

  const initialGameState = game.getGameState()
  game.commit(LOAD_LEVEL, { level, initialGameState })

  await initiateCountdown(game)
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
      clearInterval(broadcastPositionIntervalId)

      processGameOver(game, gameOverReason)
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

  const broadcastPositionIntervalId = setInterval(() => {
    if (game.type === "single") {
      clearInterval(broadcastPositionIntervalId)
    }
    game.broadcastPosition()
  }, 50)
}

function processGameOver(game: Game, gameOverReason: number) {
  if (!game || !gameOverReason) {
    return
  }

  game.setRoundStatus(false)
  game.dispatch("emitEndRoundToBackend")
  game.commit(GAME_ACTIVE, false)

  const winner = game.getPlayerWithHighestScore()
  const payload = { reason: gameOverReason, winner }
  game.dispatch("roundOver", payload)

  game.resetState()
}