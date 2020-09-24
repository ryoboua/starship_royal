const Vector = require("./Vector")
const { MISSILE_STEP } = require("../constants")

module.exports = class Missile {
  constructor(pos) {
    this.pos = new Vector(pos.x, pos.y)
    this.vel = new Vector(0, MISSILE_STEP)
    this.value = 10
  }
}
