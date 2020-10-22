const Asteroid = require("./Asteroid")
const Vector = require("./Vector")
const { GRID_SIZE } = require("../constants")

module.exports = class AsteroidField {
  constructor() {
    this.asteroids = []
    this.sequence = null
    this._s = null
  }

  generateAsteroid(numOfAsteroids) {
    if (!numOfAsteroids) {
      return
    }

    const newLine = []

    for (let i = 0; i < numOfAsteroids; i++) {
      let ast
      if (this.sequence) {
        const { value, done } = this.sequence.next()
        if (value) {
          const pos = { x: value, y: 0 }
          ast = new Asteroid(pos)
        }
      } else {
        ast = new Asteroid()
      }
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

    this.removeAsteroids(asteroidsToRemove)
  }

  removeAsteroids(astArr) {
    this.asteroids = this.asteroids.filter((ast, i) => !astArr.includes(i))
  }

  setSequence(sequence) {
    this._s = sequence
    this.sequence = this.sequenceGenerator()
  }

  *sequenceGenerator() {
    let index = 0
    while (index < this._s.length) {
      yield this._s[index++]
    }
    return
  }
}
