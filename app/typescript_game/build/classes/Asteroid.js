"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("./Vector"));
const constants_1 = require("../constants");
const asteroids_1 = __importDefault(require("../blueprints/asteroids"));
class Asteroid {
    constructor(pos) {
        this.pos = pos ? pos : Vector_1.default.random(0, constants_1.GAME_WIDTH, 0, 0);
        this.vel = new Vector_1.default(0, constants_1.ASTEROID_STEP);
        this.health = 0;
        this.initHealth = 0;
        this.destroid = false;
        this.body = JSON.parse(JSON.stringify(asteroids_1.default[1]));
    }
    static createAsteroid(pos) {
        const ast = new Asteroid(pos);
        ast.setHealth();
        return ast;
    }
    breakPiece(y, x) {
        this.body[y][x] = 0;
        this.health--;
        this.vel = Vector_1.default.add(this.vel, new Vector_1.default(0, -0.05));
        if (this.health < Math.ceil(this.initHealth * 0.25)) {
            this.destroid = true;
        }
    }
    setHealth() {
        let health = 0;
        const body = this.body;
        for (let y = 0; y < body.length; y++) {
            for (let x = 0; x < body[y].length; x++) {
                if (body[y][x])
                    health++;
            }
        }
        this.initHealth = health;
        this.health = health;
    }
    getHealth() {
        return this.health;
    }
    isDestroyed() {
        return this.destroid;
    }
    destroy() {
        this.destroid = true;
    }
}
exports.default = Asteroid;
