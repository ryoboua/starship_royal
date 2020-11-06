"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { randomNumBetween } = require("../utils");
class Vector {
    constructor(_x, _y) {
        this._x = _x;
        this._y = _y;
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static random(minX, maxX, minY, maxY) {
        return new Vector(randomNumBetween(minX, maxX), randomNumBetween(minY, maxY));
    }
    set x(x) {
        this._x = x;
    }
    get x() {
        return this._x;
    }
    set y(y) {
        this._y = y;
    }
    get y() {
        return this._y;
    }
    setX(x) {
        this._x = x;
    }
    setY(y) {
        this._y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}
exports.default = Vector;
