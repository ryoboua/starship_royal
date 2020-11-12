import Vector from "./Vector"
import { MissileModel, Blueprint } from "../../shared/interfaces"
import { MISSILE_STEP } from "../constants"

export default class Missile implements MissileModel {
    pos: Vector
    vel: Vector
    value: number
    body: Blueprint

    constructor(pos: Vector) {
        this.pos = pos
        this.vel = new Vector(0, MISSILE_STEP)
        this.value = 10
        this.body = [[1, 1], [1, 1]]
    }
}