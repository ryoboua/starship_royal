const { GRID_SIZE, STEP } = require("./constants")

function createGameState() {
  return {
    player: {
      pos: {
        x: 3,
        y: 10,
      },
      vel: {
        x: 0,
        y: 0,
      },
      keys: {
        up: false,
        down: false,
        left: false,
        right: false,
        spacebar: false,
      },
    },
    gridsize: GRID_SIZE,
  }
}

function gameloop(state) {
  if (!state) {
    return
  }

  const { player } = state
  player.pos.x += player.vel.x
  player.pos.y += player.vel.y

  if (
    player.pos.x < 0 ||
    player.pos.x > GRID_SIZE ||
    player.pos.y < 0 ||
    player.pos.y > GRID_SIZE
  ) {
    return 1
  }
}

function getUpdatedKeysDown(keyCode, keys) {
  // left
  if (keyCode === 37 || keyCode === 65) {
    return { ...keys, left: true }
  }

  // down
  if (keyCode === 38 || keyCode === 87) {
    return { ...keys, down: true }
  }

  // right
  if (keyCode === 39 || keyCode === 68) {
    return { ...keys, right: true }
  }

  // up
  if (keyCode === 40 || keyCode === 83) {
    return { ...keys, up: true }
  }
}

function getUpdatedKeysUp(keyCode, keys) {
  // left
  if (keyCode === 37 || keyCode === 65) {
    return { ...keys, left: false }
  }

  // down
  if (keyCode === 38 || keyCode === 87) {
    return { ...keys, down: false }
  }

  // right
  if (keyCode === 39 || keyCode === 68) {
    return { ...keys, right: false }
  }

  // up
  if (keyCode === 40 || keyCode === 83) {
    return { ...keys, up: false }
  }
}

function getUpdatedVelocityKeyDown(keyCode, currentVelocity) {
  // left
  if (keyCode === 37 || keyCode === 65) {
    return { ...currentVelocity, x: -STEP }
  }

  // down
  if (keyCode === 38 || keyCode === 87) {
    return { ...currentVelocity, y: -STEP }
  }

  // right
  if (keyCode === 39 || keyCode === 68) {
    return { ...currentVelocity, x: STEP }
  }

  // up
  if (keyCode === 40 || keyCode === 83) {
    return { ...currentVelocity, y: STEP }
  }
}

function getUpdatedVelocityKeyUp(keyCode, currentVelocity, keys) {
  // left
  if (keyCode === 37 || keyCode === 65) {
    return { ...currentVelocity, x: keys.right ? STEP : 0 }
  }

  // down
  if (keyCode === 38 || keyCode === 87) {
    return { ...currentVelocity, y: keys.up ? STEP : 0 }
  }

  // right
  if (keyCode === 39 || keyCode === 68) {
    return { ...currentVelocity, x: keys.left ? -STEP : 0 }
  }

  // up
  if (keyCode === 40 || keyCode === 83) {
    return { ...currentVelocity, y: keys.down ? -STEP : 0 }
  }
}

module.exports = {
  createGameState,
  gameloop,
  getUpdatedVelocityKeyDown,
  getUpdatedVelocityKeyUp,
  getUpdatedKeysUp,
  getUpdatedKeysDown,
}