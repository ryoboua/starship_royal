const { GRID_SIZE } = require("./constants")
const Player = require("./classes/Player")
const AsteroidField = require("./classes/AsteroidField")

function createGameState(id, playerNumber = 1) {
  const startPosition = { x: 500, y: 300 }
  const playerOne = new Player({ id, playerNumber, startPosition })
  return {
    players: [playerOne],
    asteroidField: new AsteroidField(),
    gridsize: GRID_SIZE,
  }
}

function gameloop(state) {
  if (!state) {
    return
  }
  const { players, asteroidField } = state
  asteroidField.updatePosition()
  players.forEach((player) => player.updatePosition(asteroidField))
  return 0
}

function addPlayer(state, player) {
  state.players.push(new Player(player))
}

module.exports = {
  createGameState,
  gameloop,
  addPlayer,
}
