import Lobby from "../../shared/classes/Lobby"
import AsteroidField from "./AsteroidField"
import { ClientModel, GameModel, Level, PlayerPositionUpdate, GameActionContext as GameFrontEndContext, GameState, PlayerScores } from "../../shared/interfaces";
import { GRID_SIZE, ROUND_TIME, GAME_OVER_REASONS } from "../constants"
import Vector from './Vector';

export default class Game extends Lobby implements GameModel {
  level: number
  levels: Level[]
  asteroidField: AsteroidField
  gridsize: number
  timer: number
  _context: GameFrontEndContext | undefined

  constructor() {
    super()
    this.level = 0
    this.levels = []
    this.asteroidField = new AsteroidField()
    this.gridsize = GRID_SIZE
    this.timer = ROUND_TIME
    this._context
  }

  static createGameState(players: ClientModel[], context: GameFrontEndContext): Game {
    const game = new Game()

    players.forEach(player => game.addPlayer(player))
    game.setFrontEndContext(context)

    return game
  }

  get type() {
    return this._context?.rootState.game.type || 'single'
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
    this._context?.dispatch(eventName, data)
  }

  commit(eventName: string, data?: any) {
    this._context?.commit(eventName, data)
  }

  gameLoop(): GAME_OVER_REASONS | undefined {
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
      return GAME_OVER_REASONS["ALL_DEAD"]
    }

    // if (!this.timer) {
    //   return GAME_OVER_REASONS["TIMER"]
    // }

    return
  }

  getGameState(): GameState {
    return {
      players: this.players,
      asteroidField: this.asteroidField,
      gridsize: this.gridsize,
      timer: this.timer,
      playerScores: this.playerScores,
    }
  }

  get playerScores(): PlayerScores {
    return Object.values(this.players)
      .map((player) => ({
        name: player.name,
        score: player.score,
        color: player.color
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
    return this._context?.rootState.client.socketId === socketId
  }

  getPlayerWithHighestScore() {
    const { name, score } = Object.values(this.players).sort((a, b) => b.score - a.score)[0]

    return { name, score }
  }

  getPlayerPosition(socketId: string): Vector {
    return this.players[socketId].pos
  }

  broadcastPosition() {
    if (!this._context) {
      return
    }
    const { socketId } = this._context.rootState.client
    const { pos } = this.players[socketId]
    const payload: PlayerPositionUpdate = { socketId, pos }

    this.dispatch("broadcastPosition", payload)
  }
}
