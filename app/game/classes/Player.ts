import Client from "../../shared/classes/Client"
import Vector from "./Vector"
import Keys from "./Keys"
import Missiles from "./Missiles"
import { PlayerModel, ClientModel, Blueprint } from "../../shared/interfaces"
import AsteroidField from "./AsteroidField";
import { GRID_SIZE, SPACE_STEP, ASTEROID_VALUE } from "../constants"

export default class Player extends Client implements PlayerModel {
  score: number
  pos: Vector
  vel: Vector
  keys: Keys
  weapons: Missiles
  isAlive: boolean
  left: boolean
  body: Blueprint

  constructor(client: ClientModel) {
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
    const numOfDestroyedAsteroids = this.weapons.updateMissilePositions(asteroidField)

    if (numOfDestroyedAsteroids) {
      this.score += numOfDestroyedAsteroids * ASTEROID_VALUE
    }

    this.updateSpaceshipPosition(asteroidField, isLocal)
  }

  updateSpaceshipPosition(asteroidField: AsteroidField, isLocal: boolean) {
    const pos = Vector.add(this.pos, this.vel)
    const playerBodyCoordinates = this.getBodyCoordinates(pos)

    // if (isLocal) {
    //   for (let i = 0; i < asteroidField.asteroids.length; i++) {

    //     const ast = asteroidField.asteroids[i];
    //     const hit = ast.playerCollisionCheck(playerBodyCoordinates)

    //     if (hit) {
    //       this.isAlive = false
    //       return
    //     }
    //   }

    // }

    //check if player is in game bounderies
    for (let j = 0; j < playerBodyCoordinates.length; j++) {
      const p = playerBodyCoordinates[j];
      if (p.x - GRID_SIZE < 0) {
        pos.x = pos.x + SPACE_STEP
        break;
      }
      if (p.x + 2 * GRID_SIZE > 1000) {
        pos.x = pos.x - SPACE_STEP
        break;
      }
      if (p.y - GRID_SIZE < 0) {
        pos.y = pos.y + SPACE_STEP
        break;
      }
      if (p.y + GRID_SIZE > 600) {
        pos.y = pos.y - SPACE_STEP
        break;
      }
    }
    this.pos = pos
  }

  updateVelocityKeyDown(keyCode: number) {
    if (!keyCode) {
      return
    }
    // left
    if (keyCode === 37 || keyCode === 65) {
      this.vel.x = -SPACE_STEP
    }
    // down
    if (keyCode === 38 || keyCode === 87) {
      this.vel.y = -SPACE_STEP
    }
    // right
    if (keyCode === 39 || keyCode === 68) {
      this.vel.x = SPACE_STEP
    }
    // up
    if (keyCode === 40 || keyCode === 83) {
      this.vel.y = SPACE_STEP
    }
  }

  updateVelocityKeyUp(keyCode: number) {
    if (!keyCode) {
      return
    }
    // left
    if (keyCode === 37 || keyCode === 65) {
      this.vel.x = this.keys.right ? SPACE_STEP : 0
    }
    // down
    if (keyCode === 38 || keyCode === 87) {
      this.vel.y = this.keys.up ? SPACE_STEP : 0
    }
    // right
    if (keyCode === 39 || keyCode === 68) {
      this.vel.x = this.keys.left ? -SPACE_STEP : 0
    }
    // up
    if (keyCode === 40 || keyCode === 83) {
      this.vel.y = this.keys.down ? -SPACE_STEP : 0
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

  getBodyCoordinates(pos: Vector): Vector[] {
    const arr = []
    const body = this.body

    for (let y = 0; y < this.body.length; y++) {
      for (let x = 0; x < this.body[y].length; x++) {
        if (body[y][x]) {
          const posY = (y * GRID_SIZE) + pos.y
          const posX = (x * GRID_SIZE) + pos.x
          arr.push(new Vector(posX, posY))
        }
      }
    }

    return arr
  }
}
