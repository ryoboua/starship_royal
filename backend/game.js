const { GRID_SIZE, STEP } = require("./constants")
const Player = require("./Classes/player")

function createGameState() {
  return {
    player: new Player(500, 300),
    gridsize: GRID_SIZE,
  }
}

function gameloop(state) {
  if (!state) {
    return
  }
  state.player.updatePosition()
}

module.exports = {
  createGameState,
  gameloop,
}
