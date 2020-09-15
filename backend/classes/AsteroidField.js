const Asteroid = require("./Asteroid")
const Vector = require("./Vector")
const { GRID_SIZE } = require("../constants")

module.exports = class AsteroidField {
  constructor() {
    this.asteroids = []
  }

  generateAsteroid(num) {
    if (!num) {
      return
    }

    const newLine = []

    for (let i = 0; i < num; i++) {
      const ast = new Asteroid()
      //todo: check if new astroid position already taken
      newLine.push(ast)
    }
    this.asteroids.push(...newLine)
  }

  updatePosition() {
    if (!this.asteroids.length) {
      return
    }
    const asteroidsToRemove = []
    this.asteroids.forEach((ast, i) => {
      const newPos = Vector.add(ast.pos, ast.vel)
      const newY = newPos.getY()
      if (newY + GRID_SIZE > 600) {
        asteroidsToRemove.push(i)
      } else {
        ast.pos = newPos
      }
    })

    this.asteroids = this.asteroids.filter(
      (ast, i) => !asteroidsToRemove.includes(i)
    )
  }
}
