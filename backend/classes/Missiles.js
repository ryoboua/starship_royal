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

  updateMissilePositions() {
    if (!this.missiles.length) {
      return
    }
    const missilesToRemove = []
    this.missiles.forEach((mis, i) => {
      const newPos = Vector.sub(mis.pos, mis.vel)
      const newY = newPos.getY()
      if (newY - GRID_SIZE < 0) {
        missilesToRemove.push(i)
      } else {
        mis.pos = newPos
      }
    })

    this.missiles = this.missiles.filter(
      (mis, i) => !missilesToRemove.includes(i)
    )
  }
}
