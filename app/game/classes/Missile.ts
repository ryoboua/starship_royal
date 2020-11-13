import Vector from "./Vector"
import { MissileModel, Blueprint } from "../../shared/interfaces"
import { MISSILE_STEP, GRID_SIZE } from "../constants"

export default class Missile implements MissileModel {
    pos: Vector
    vel: Vector
    value: number
    body: Blueprint
    destroyed: boolean

    constructor(pos: Vector) {
        this.pos = pos
        this.vel = new Vector(0, MISSILE_STEP)
        this.value = 10
        this.body = [[1, 1], [1, 1]]
        this.destroyed = false
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