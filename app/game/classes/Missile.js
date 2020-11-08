"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("./Vector"));
const constants_1 = require("../constants");
class Missile {
    constructor(pos) {
        this.pos = pos;
        this.vel = new Vector_1.default(0, constants_1.MISSILE_STEP);
        this.value = 10;
        this.body = [[0, 1, 0], [1, 0, 1]];
    }
}
exports.default = Missile;
