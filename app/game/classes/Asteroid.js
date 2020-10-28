const Vector = require("./Vector")
const { ASTEROID_STEP, GAME_WIDTH } = require("../constants")

module.exports = class Asteroid {
  constructor(pos) {
    this.pos = !pos ? Vector.random(0, GAME_WIDTH, 0, 0) : new Vector(pos.x, pos.y)
    this.vel = new Vector(0, ASTEROID_STEP)
    this.value = 10
    this.body = [[0, 0, 1, 1, 0], [0, 1, 1, 1, 0], [0, 0, 1, 1, 1], [0, 1, 1, 1, 1], [0, 1, 1, 0, 0]]
  }
  breakPiece(y,x) {
    this.body[y][x] = 0
  }
}
