module.exports = class Level {
  constructor({ level, numOfAsteroids, asteroidFieldTimeInterval }) {
    this.level = level
    this.numOfAsteroids = numOfAsteroids
    this.asteroidFieldTimeInterval = asteroidFieldTimeInterval
    this.timer = 10
  }

  startLevelTimer() {}
}
