import Vector from "./Vector"
import { MISSILE_STEP } from "../constants"


export default class Missile {
    private pos: Vector
    private vel: Vector
    private value: number
    private body: Array<Array<number>>

    constructor(pos: Vector) {
        this.pos = pos
        this.vel = new Vector(0, MISSILE_STEP)
        this.value = 10
        this.body = [[0, 1, 0], [1, 0, 1]]
    }
}