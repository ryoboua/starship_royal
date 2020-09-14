const Vector = require("./Vector")

module.exports = class Asteroid {
  constructor(pos) {
    this.pos = !pos ? Vector.random(0, 1000, 0, 0) : new Vector(pos)
    this.vel = new Vector(0, 1)
    this.value = 10
  }
}
