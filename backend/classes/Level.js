module.exports = class Level {
  constructor({ number, numOfAsteroids, asteroidFieldTimeInterval }) {
    this.number = number
    this.numOfAsteroids = numOfAsteroids
    this.asteroidFieldTimeInterval = asteroidFieldTimeInterval
    this.timer = 30
  }
}
