const { GRID_SIZE } = require("./constants")
const Player = require("./classes/Player")
const AsteroidField = require("./classes/AsteroidField")

function createGameState() {
  return {
    player: new Player(500, 300),
    asteroidField: new AsteroidField(),
    gridsize: GRID_SIZE,
  }
}

function gameloop(state) {
  if (!state) {
    return
  }
  const { player, asteroidField } = state
  player.updatePosition()
  asteroidField.updatePosition()
}

module.exports = {
  createGameState,
  gameloop,
}
