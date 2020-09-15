const Missile = require("./Missile")
const Vector = require("./Vector")

const { GRID_SIZE } = require("../constants")

module.exports = class Missiles {
  constructor() {
    this.missiles = []
  }

  generateMissile(pos) {
    this.missiles.push(new Missile(pos))
  }

  updateMissilePositions(asteroidField) {
    if (!this.missiles.length) {
      return
    }
    const missilesToRemove = []
    const asteroidsToRemove = []

    this.missiles.forEach((mis, missileIndex) => {
      const newPos = Vector.sub(mis.pos, mis.vel)
      const newY = newPos.getY()
      const newX = newPos.getX()

      asteroidField.asteroids.forEach((ast, asteroidIndex) => {
        if (
          newX < ast.pos.x + GRID_SIZE &&
          newX + GRID_SIZE > ast.pos.x &&
          newY < ast.pos.y + GRID_SIZE &&
          newY + GRID_SIZE > ast.pos.y
        ) {
          asteroidsToRemove.push(asteroidIndex)
          missilesToRemove.push(missileIndex)
        }
      })

      //check collisions
      if (newY - GRID_SIZE < 0) {
        if (!missilesToRemove.includes(missileIndex)) {
          missilesToRemove.push(missileIndex)
        }
      } else {
        mis.pos = newPos
      }
    })

    asteroidField.removeAsteroids(asteroidsToRemove)

    this.missiles = this.missiles.filter(
      (mis, i) => !missilesToRemove.includes(i)
    )
  }
}
