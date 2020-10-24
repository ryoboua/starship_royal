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
      let pos = null
      if (this.sequence) {
        pos = this.generateAsteroidPositionFromSequence()
      }
      const ast = new Asteroid(pos)
      newLine.push(ast)
    }
    this.asteroids.push(...newLine)
  }

  generateAsteroidPositionFromSequence() {
    const { value, done } = this.sequence.next()
    const pos = { x: value ? value : 25, y: 0 }
    if (done) {
      this.resetSequenceGenerator()
    }
    return pos
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
    if (!astArr.length) {
      return
    }
    this.asteroids = this.asteroids.filter((ast, i) => !astArr.includes(i))
  }

  setSequence(sequence) {
    if (!sequence) {
      return
    }
    this._s = sequence
    this.sequence = this.sequenceGenerator()
  }

  resetSequenceGenerator() {
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
