import { randomNumBetween } from "../../shared/utils"
import { Point2D } from "../../shared/interfaces"

export default class Vector implements Point2D {
    public x: number
    public y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    static add(v1: Vector, v2: Vector) {
        return new Vector(v1.x + v2.x, v1.y + v2.y)
    }

    static sub(v1: Vector, v2: Vector) {
        return new Vector(v1.x - v2.x, v1.y - v2.y)
    }

    static random(minX: number, maxX: number, minY: number, maxY: number): Vector {
        return new Vector(
            randomNumBetween(minX, maxX),
            randomNumBetween(minY, maxY)
        )
    }
}