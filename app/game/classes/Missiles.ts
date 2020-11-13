import Missile from "./Missile"
import Vector from "./Vector"
import { GRID_SIZE } from "../constants"
import AsteroidField from "./AsteroidField"

export default class Missiles {
    private missiles: Missile[]

    constructor() {
        this.missiles = []
    }

    generateMissile(pos: Vector): void {
        this.missiles.push(new Missile(pos))
    }

    updateMissilePositions(asteroidField: AsteroidField): number | undefined {
        if (!this.missiles.length) {
            return
        }

        let numOfDestroyedAsteroids = 0

        this.missiles.forEach((mis) => {
            const pos = Vector.sub(mis.pos, mis.vel)
            const missileBodyCoordinates = mis.getBodyCoordinates(pos)

            for (let i = 0; i < asteroidField.asteroids.length; i++) {
                const ast = asteroidField.asteroids[i];
                const hit = ast.missileCollisionCheck(missileBodyCoordinates)

                if (hit) {
                    numOfDestroyedAsteroids++
                    mis.destroyed = true
                    break;
                }
            }

            if (mis.destroyed) {
                return
            }

            if (pos.y - GRID_SIZE < 0) {
                mis.destroyed = true
            } else {
                mis.pos = pos
            }
        })

        this.removeMissiles()
        return numOfDestroyedAsteroids
    }

    removeMissiles() {
        this.missiles = this.missiles.filter((mis) => !mis.destroyed)
    }
}
