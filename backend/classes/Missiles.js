const Missile = require("./Missile")
const Vector = require("./Vector")

const { GRID_SIZE, STEP } = require("../constants")

module.exports = class Missiles {
  constructor() {
    this.missiles = []
  }

  generateMissile(pos) {
    this.missiles.push(new Missile(pos))
  }
}
