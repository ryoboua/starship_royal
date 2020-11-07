import { randomNumBetween } from "../utils"
import { Point2D } from "./Interfaces"


export default class Vector implements Point2D {
    x: number
    y: number
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

    // set x(x: number) {
    //     this._x = x
    // }
    // get x() {
    //     return this._x
    // }
    // set y(y: number) {
    //     this._y = y
    // }
    // get y() {
    //     return this._y
    // }

    setX(x: number) {
        this.x = x
    }
    setY(y: number) {
        this.y = y
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }

}