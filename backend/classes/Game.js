const { GRID_SIZE } = require("../constants")
const Player = require("./Player")
const AsteroidField = require("./AsteroidField")

module.exports = class Game {
  constructor({ players, asteroidField, gridsize }) {
    this.players = players
    this.asteroidField = asteroidField
    this.gridsize = gridsize
  }

  static createGameState(id, playerNumber = 1) {
    const startPosition = { x: 200, y: 500 }
    const playerOne = new Player({ id, playerNumber, startPosition })
    return new Game({
      players: [playerOne],
      asteroidField: new AsteroidField(),
      gridsize: GRID_SIZE,
    })
  }

  gameLoop() {
    this.asteroidField.updatePosition()
    this.players.forEach((player) => {
      if (player.isAlive) player.updatePosition(this.asteroidField)
    })
    return 0
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
        number: player.playerNumber,
        score: player.score,
      }))
      .sort((a, b) => b.score - a.score)
  }

  addPlayer(player) {
    this.players.push(new Player(player))
  }
}
