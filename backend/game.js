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
  asteroidField.updatePosition()
  return player.updatePosition(asteroidField)
}

module.exports = {
  createGameState,
  gameloop,
}
