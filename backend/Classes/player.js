const Vector = require("./Vector")
const Keys = require("./Keys")
const Missiles = require("./Missiles")
const { GRID_SIZE, SPACE_STEP } = require("../constants")

module.exports = class Player {
  constructor(x, y) {
    this.pos = new Vector(x, y)
    this.vel = new Vector(0, 0)
    this.keys = new Keys()
    this.weapons = new Missiles()
  }

  updatePosition() {
    this.updateSpaceshipPosition()
    this.updateMissilePosition()
    this.fireMissile()
  }

  updateSpaceshipPosition() {
    const newPos = Vector.add(this.pos, this.vel)
    const newX = newPos.getX()
    const newY = newPos.getY()

    //check if player is in game bounderies
    if (newX - GRID_SIZE < 0) {
      newPos.setX(newX + SPACE_STEP)
    }
    if (newX + 2 * GRID_SIZE > 1000) {
      newPos.setX(newX - SPACE_STEP)
    }
    if (newY - GRID_SIZE < 0) {
      newPos.setY(newY + SPACE_STEP)
    }
    if (newY + GRID_SIZE > 600) {
      newPos.setY(newY - SPACE_STEP)
    }
    this.pos = newPos
  }

  updateVelocityKeyDown(keyCode) {
    if (!keyCode) {
      return
    }
    // left
    if (keyCode === 37 || keyCode === 65) {
      this.vel.setX(-SPACE_STEP)
    }
    // down
    if (keyCode === 38 || keyCode === 87) {
      this.vel.setY(-SPACE_STEP)
    }
    // right
    if (keyCode === 39 || keyCode === 68) {
      this.vel.setX(SPACE_STEP)
    }
    // up
    if (keyCode === 40 || keyCode === 83) {
      this.vel.setY(SPACE_STEP)
    }
  }

  updateVelocityKeyUp(keyCode) {
    if (!keyCode) {
      return
    }
    // left
    if (keyCode === 37 || keyCode === 65) {
      this.vel.setX(this.keys.right ? SPACE_STEP : 0)
    }
    // down
    if (keyCode === 38 || keyCode === 87) {
      this.vel.setY(this.keys.up ? SPACE_STEP : 0)
    }
    // right
    if (keyCode === 39 || keyCode === 68) {
      this.vel.setX(this.keys.left ? -SPACE_STEP : 0)
    }
    // up
    if (keyCode === 40 || keyCode === 83) {
      this.vel.setY(this.keys.down ? -SPACE_STEP : 0)
    }
  }

  fireMissile() {
    if (this.keys.spacebar) {
      const pos = Vector.add(this.pos, new Vector(0, -2 * GRID_SIZE))
      this.weapons.generateMissile(pos)
    }
  }

  updateMissilePosition() {
    if (!this.weapons.missiles.length) {
      return
    }

    this.weapons.missiles.forEach((mis) => {
      const newPos = Vector.sub(mis.pos, mis.vel)
      const newY = newPos.getY()
      mis.pos = newPos
    })
  }
}
