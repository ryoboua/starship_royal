const { GRID_SIZE } = require("../constants")
const Player = require("./Player")
const Level = require("./Level")
const AsteroidField = require("./AsteroidField")

module.exports = class Game {
  constructor() {
    this.players = {}
    this.levels = []
    this.asteroidField = new AsteroidField()
    this.gridsize = GRID_SIZE
    this.timer = 30
    this._emit = null
    this.roundActive = false
  }

  static createGameState(players, emitter) {
    const game = new Game()

    players.forEach(player => game.addPlayer(player))
    game.setGameEmitter(emitter)

    return game
  }

  resetState() {
    this.timer = 30
    this.asteroidField = new AsteroidField()
    Object.values(this.players).forEach((player) => player.reset())
  }

  setGameEmitter(emit) {
    this._emit = emit
  }

  emit(eventName, data = null) {
    this._emit(eventName, data)
  }

  gameLoop() {
    this.asteroidField.updatePosition()
    Object.values(this.players).forEach((player) => {
      if (player.isAlive) player.updatePosition(this.asteroidField)
    })

    if (!Object.values(this.players).some((player) => player.isAlive)) {
      return 1
    }

    if (!this.timer) {
      return 2
    }
    return
  }

  getGameState() {
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

  addPlayer(client) {
    if (Object.values(this.players).some(player => player.socketId === client.socketId)) {
      return
    }
    const player = new Player(client)
    this.players[player.socketId] = player
  }

  removePlayer(socketId) {
    delete this.players[socketId]
  }

  getPlayerList() {
    return Object.values(this.players)
  }

  addLevel(level) {
    level = new Level(level)
    this.levels.push(level)
  }

  setTimer(time) {
    this.timer = time
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

  setRoundStatus(b) {
    this.roundActive = b
  }

  isRoundActive() {
    return this.roundActive
  }

  getCurrentLevel() {
    return this.levels.length
  }
}
