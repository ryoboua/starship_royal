const Vector = require("./Vector")
const { ASTEROID_STEP, GAME_WIDTH } = require("../constants")

module.exports = class Asteroid {
  constructor(pos) {
    this.pos = !pos ? Vector.random(0, GAME_WIDTH, 0, 0) : new Vector(pos.x, pos.y)
    this.vel = new Vector(0, ASTEROID_STEP)
    this.health = 0
    this.destroid = false
    this.body = [[0, 0, 1, 1, 0], [0, 1, 1, 1, 0], [0, 0, 1, 1, 1], [0, 1, 1, 1, 1], [0, 1, 1, 0, 0]]
  }

  static createAsteroid(pos) {
    const ast = new Asteroid(pos)
    ast.setHealth()

    return ast

  }
  breakPiece(y, x) {
    this.body[y][x] = 0
    this.health--
    this.vel = Vector.add(this.vel, new Vector(0, -0.05))

    if (this.health < 4) {
      this.destroid = true
    }
  }

  setHealth() {
    let health = 0
    const body = this.body;
    for (let y = 0; y < body.length; y++) {
      for (let x = 0; x < body[y].length; x++) {
        if (body[y][x]) health++
      }
    }
    this.health = health
  }

  getHealth() {
    return this.health
  }

  isDestroyed() {
    return this.destroid
  }

  destroy() {
    this.destroid = true
  }
}
