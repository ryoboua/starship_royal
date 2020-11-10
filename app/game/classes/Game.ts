import Lobby from "../../shared/classes/Lobby"
import AsteroidField from "./AsteroidField"
import { ClientModel, GameModel, Level, GameActionContext as GameFrontEndContext, GameState } from "../../shared/interfaces";
import { GRID_SIZE, ROUND_TIME } from "../constants"

export default class Game extends Lobby implements GameModel {
  levels: Level[]
  asteroidField: AsteroidField
  gridsize: number
  timer: number
  _context: any

  constructor() {
    super()
    this.levels = []
    this.asteroidField = new AsteroidField()
    this.gridsize = GRID_SIZE
    this.timer = ROUND_TIME
    this._context = null
  }

  static createGameState(players: Array<ClientModel>, context: any) {
    const game = new Game()

    players.forEach(player => game.addPlayer(player))
    game.setFrontEndContext(context)

    return game
  }

  resetState() {
    this.timer = ROUND_TIME
    this.asteroidField = new AsteroidField()
    Object.values(this.players).forEach((player) => player.reset())
  }

  setFrontEndContext(context: GameFrontEndContext) {
    this._context = context
  }

  dispatch(eventName: string, data?: any) {
    this._context.dispatch(eventName, data)
  }

  commit(eventName: string, data?: any) {
    this._context.commit(eventName, data)
  }

  gameLoop() {
    this.asteroidField.updatePosition()
    Object.values(this.players).forEach((player) => {
      if (player.isAlive) {
        player.updatePosition(this.asteroidField, this.isLocal(player.socketId))
        if (!player.isAlive) {
          this.dispatch("playerDead", player.socketId)
        }
      }
    })

    if (!Object.values(this.players).some((player) => player.isAlive)) {
      return 1
    }

    // if (!this.timer) {
    //   return 2
    // }
    return
  }

  getGameState(): GameState {
    return {
      players: this.players,
      asteroidField: this.asteroidField,
      gridsize: this.gridsize,
      timer: this.timer,
      playerScores: this.getPlayerScores(),
    }
  }

  getPlayerScores() {
    return Object.values(this.players)
      .map((player) => ({
        name: player.name,
        score: player.score,
      }))
      .sort((a, b) => b.score - a.score)
  }

  addLevel(level: Level) {
    this.levels.push(level)
  }

  decrementTimer() {
    if (!this.timer) {
      return
    }
    this.timer--
  }

  endRound() {
    this.resetState()

  }

  getCurrentLevel(): number {
    return this.levels.length
  }

  destroyShip(socketId: string) {
    const player = this.players[socketId]

    if (!player) {
      return
    }

    player.selfDestruct()
  }

  isLocal(socketId: string): boolean {
    return this._context.rootState.client.socketId === socketId
  }
}
