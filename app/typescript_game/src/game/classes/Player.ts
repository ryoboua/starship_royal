import Client from "./Client"
import Vector from "./Vector"
import Keys from "./Keys"
import Missiles from "./Missiles"
import { IPlayer, IClient } from "./Interfaces"
import AsteroidField from "./AsteroidField";
import { GRID_SIZE, SPACE_STEP, ASTEROID_VALUE } from "../constants"

export default class Player extends Client implements IPlayer {
  score: number
  pos: Vector
  vel: Vector
  keys: Keys
  weapons: Missiles
  isAlive: boolean
  left: boolean
  body: Array<Array<number>>

  constructor(client: IClient) {
    super({ ...client })
    this.score = 0
    this.pos = new Vector(client.playerNumber * 200, 500)
    this.vel = new Vector(0, 0)
    this.keys = new Keys()
    this.weapons = new Missiles()
    this.isAlive = true
    this.left = false
    this.body = [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 1, 1, 1, 1]]
  }

  reset() {
    this.pos = new Vector(this.playerNumber * 200, 500)
    this.vel = new Vector(0, 0)
    this.keys = new Keys()
    this.weapons = new Missiles()
    this.isAlive = true
  }

  selfDestruct() {
    this.isAlive = false
  }

  updatePosition(asteroidField: AsteroidField, isLocal: boolean) {
    this.weapons.updateMissilePositions(asteroidField)
    this.updateSpaceshipPosition(asteroidField, isLocal)
  }

  updateSpaceshipPosition(asteroidField: AsteroidField, isLocal: boolean) {
    const newPos = Vector.add(this.pos, this.vel)
    const newX = newPos.getX()
    const newY = newPos.getY()

    // if (isLocal) {
    //   const hit = asteroidField.asteroids.some(
    //     (ast) =>
    //       newX <= ast.pos.x + GRID_SIZE &&
    //       newX + GRID_SIZE >= ast.pos.x &&
    //       newY <= ast.pos.y + GRID_SIZE &&
    //       newY + GRID_SIZE >= ast.pos.y
    //   )

    //   if (hit) {
    //     this.isAlive = false
    //     return
    //   }
    // }


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

  updateVelocityKeyDown(keyCode: number) {
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

  updateVelocityKeyUp(keyCode: number) {
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
      const x = this.left ? 1 : 3
      this.left = !this.left

      let y = 0
      if (this.vel.y < 0) {
        y = -10
      }


      const pos = Vector.add(this.pos, new Vector(x * GRID_SIZE, y))
      this.weapons.generateMissile(pos)
    }
  }
}
