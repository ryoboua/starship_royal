import Vector from "./Vector"
import { MissileModel } from "../../shared/interfaces"
import { MISSILE_STEP } from "../constants"



export default class Missile implements MissileModel {
    pos: Vector
    vel: Vector
    value: number
    body: Array<Array<number>>

    constructor(pos: Vector) {
        this.pos = pos
        this.vel = new Vector(0, MISSILE_STEP)
        this.value = 10
        this.body = [[0, 1, 0], [1, 0, 1]]
    }
}