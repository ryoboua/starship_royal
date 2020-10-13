const { GRID_SIZE } = require("../constants")
const Player = require("./Player")
const Level = require("./Level")
const AsteroidField = require("./AsteroidField")
const levelParams = require("../levels")

module.exports = class Game {
  constructor() {
    this.players = {}
    this.levels = []
    this.asteroidField = new AsteroidField()
    this.gridsize = GRID_SIZE
    this.timer = 20
    this.emit = null
  }

  static createGameState(client, emitter) {
    const game = new Game()

    const startPosition = { x: 200, y: 500 }
    game.addPlayer(client, startPosition)
    game.addLevel(levelParams[0])
    game.setGameEmitter(emitter)

    return game
  }

  resetState() {
    this.timer = 30
    this.asteroidField = new AsteroidField()
    Object.values(this.players).forEach((player) => player.reset())
  }

  setGameEmitter(emit) {
    this.emit = emit
  }

  gameLoop() {
    this.asteroidField.updatePosition()
    Object.values(this.players).forEach((player) => {
      if (player.isAlive) player.updatePosition(this.asteroidField)
    })

    // if (!Object.values(this.players).some((player) => player.isAlive)) {
    //   return 1
    // }

    if (!this.timer) {
      return 2
    }
    return
  }

  getGameState() {
    return JSON.stringify({
      players: this.players,
      asteroidField: this.asteroidField,
      gridsize: this.gridsize,
      timer: this.timer,
      playerScores: this.getPlayerScores(),
    })
  }

  getPlayerScores() {
    return Object.values(this.players)
      .map((player) => ({
        name: player.name,
        score: player.score,
      }))
      .sort((a, b) => b.score - a.score)
  }

  addPlayer(client, startPosition) {
    const player = new Player(client, startPosition)
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
    if (this.levels.length >= 4) {
      return
    }
    this.resetState()
    const level = levelParams[this.levels.length + 1]
    this.addLevel(level)
    return level
  }
}
