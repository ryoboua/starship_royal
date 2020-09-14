const Vector = require("./Vector")
const Keys = require("./Keys")
const { GRID_SIZE, STEP } = require("../constants")

module.exports = class Player {
  constructor(x, y) {
    this.pos = new Vector(x, y)
    this.vel = new Vector(0, 0)
    this.keys = new Keys()
  }

  updatePosition() {
    const newPos = Vector.add(this.pos, this.vel)
    const newX = newPos.getX()
    const newY = newPos.getY()

    //check if player is in game bounderies
    if (newX - GRID_SIZE < 0) {
      newPos.setX(newX + STEP)
    }
    if (newX + 2 * GRID_SIZE > 1000) {
      newPos.setX(newX - STEP)
    }
    if (newY - GRID_SIZE < 0) {
      newPos.setY(newY + STEP)
    }
    if (newY + GRID_SIZE > 600) {
      newPos.setY(newY - STEP)
    }
    this.pos = newPos
  }

  updateVelocityKeyDown(keyCode) {
    if (!keyCode) {
      return
    }
    // left
    if (keyCode === 37 || keyCode === 65) {
      this.vel.setX(-STEP)
    }
    // down
    if (keyCode === 38 || keyCode === 87) {
      this.vel.setY(-STEP)
    }
    // right
    if (keyCode === 39 || keyCode === 68) {
      this.vel.setX(STEP)
    }
    // up
    if (keyCode === 40 || keyCode === 83) {
      this.vel.setY(STEP)
    }
  }

  updateVelocityKeyUp(keyCode) {
    if (!keyCode) {
      return
    }
    // left
    if (keyCode === 37 || keyCode === 65) {
      this.vel.setX(this.keys.right ? STEP : 0)
    }
    // down
    if (keyCode === 38 || keyCode === 87) {
      this.vel.setY(this.keys.up ? STEP : 0)
    }
    // right
    if (keyCode === 39 || keyCode === 68) {
      this.vel.setX(this.keys.left ? -STEP : 0)
    }
    // up
    if (keyCode === 40 || keyCode === 83) {
      this.vel.setY(this.keys.down ? -STEP : 0)
    }
  }
}
