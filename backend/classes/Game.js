const { GRID_SIZE } = require("../constants")
const Player = require("./Player")
const Level = require("./Level")
const AsteroidField = require("./AsteroidField")
const levelParams = require("../levels")

module.exports = class Game {
  constructor() {
    this.players = []
    this.levels = []
    this.asteroidField = new AsteroidField()
    this.gridsize = GRID_SIZE
  }

  static createGameState(client) {
    const game = new Game()

    const startPosition = { x: 200, y: 500 }
    game.addPlayer(client, startPosition)
    game.addLevel(levelParams[0])

    return game
  }

  gameLoop() {
    this.asteroidField.updatePosition()
    this.players.forEach((player) => {
      if (player.isAlive) player.updatePosition(this.asteroidField)
    })

    if (!this.players.some((player) => player.isAlive)) {
      return 1
    }
    return 
  }

  getGameState() {
    return {
      players: this.players,
      asteroidField: this.asteroidField,
      gridsize: this.gridsize,
      playerScores: this.getPlayerScores(),
    }
  }

  getPlayerScores() {
    return this.players
      .map((player) => ({
        name: player.name,
        score: player.score,
      }))
      .sort((a, b) => b.score - a.score)
  }

  addPlayer(client, startPosition) {
    const player = new Player(client, startPosition)
    this.players.push(player)
  }

  addLevel(level) {
    level = new Level(level)
    this.levels.push(level)
  }
}
