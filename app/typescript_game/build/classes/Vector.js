"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static random(minX, maxX, minY, maxY) {
        return new Vector(utils_1.randomNumBetween(minX, maxX), utils_1.randomNumBetween(minY, maxY));
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}
exports.default = Vector;
