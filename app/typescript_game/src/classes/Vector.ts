const { randomNumBetween } = require("../utils")
export default class Vector {

    constructor(private _x: number, private _y: number) { }

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

    set x(x: number) {
        this._x = x
    }
    get x() {
        return this._x
    }
    set y(y: number) {
        this._y = y
    }
    get y() {
        return this._y
    }

    setX(x: number) {
        this._x = x
    }
    setY(y: number) {
        this._y = y
    }
    getX() {
        return this.x
    }
    getY() {
        return this.y
    }

}