import Missile from "./Missile"
import Vector from "./Vector"

import { GRID_SIZE } from "../constants"

export default class Missiles {
    private missiles: Array<Missile>
    constructor() {
        this.missiles = []
    }

    generateMissile(pos: Vector): void {
        this.missiles.push(new Missile(pos))
    }

    updateMissilePositions(asteroidField): void {
        if (!this.missiles.length) {
            return
        }
        const missilesToRemove = []

        this.missiles.forEach((mis, missileIndex) => {
            const newPos = Vector.sub(mis.pos, mis.vel)
            const newY = newPos.y
            const newX = newPos.x

            asteroidField.asteroids.forEach((ast, asteroidIndex) => {
                const body = ast.body;
                for (let y = 0; y < body.length; y++) {
                    for (let x = 0; x < body[y].length; x++) {
                        if (body[y][x]) {
                            const posY = (y * GRID_SIZE) + ast.pos.y
                            const posX = (x * GRID_SIZE) + ast.pos.x
                            if (
                                newX < posX + GRID_SIZE &&
                                newX + GRID_SIZE > posX &&
                                newY < posY + GRID_SIZE &&
                                newY + GRID_SIZE > posY
                            ) {
                                ast.breakPiece(y, x)
                                missilesToRemove.push(missileIndex)
                            }
                        }
                    }
                }
            })

            //check collisions
            if (newY - GRID_SIZE < 0) {
                if (!missilesToRemove.includes(missileIndex)) {
                    missilesToRemove.push(missileIndex)
                }
            } else {
                mis.pos = newPos
            }
        })

        this.removeMissiles(missilesToRemove)
        return missilesToRemove.length
    }

    removeMissiles(missArr) {
        this.missiles = this.missiles.filter(
            (mis, i) => !missArr.includes(i)
        )
    }
}
