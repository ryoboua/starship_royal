"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Asteroid_1 = __importDefault(require("./Asteroid"));
const Vector_1 = __importDefault(require("./Vector"));
const constants_1 = require("../constants");
class AsteroidField {
    constructor() {
        this.asteroids = [];
        this.sequence = null;
        this._s = null;
    }
    generateAsteroid(numOfAsteroids) {
        if (!numOfAsteroids) {
            return;
        }
        const newLine = [];
        for (let i = 0; i < numOfAsteroids; i++) {
            let pos;
            if (this.sequence) {
                const { x, y } = this.generateAsteroidPositionFromSequence();
                pos = new Vector_1.default(x, y);
            }
            const ast = Asteroid_1.default.createAsteroid(pos);
            newLine.push(ast);
        }
        this.asteroids.push(...newLine);
    }
    generateAsteroidPositionFromSequence() {
        if (!this.sequence) {
            return { x: 0, y: 0 };
        }
        const { value, done } = this.sequence.next();
        const pos = { x: value ? value : 25, y: 0 };
        if (done) {
            this.resetSequenceGenerator();
        }
        return pos;
    }
    updatePosition() {
        if (!this.asteroids.length) {
            return;
        }
        this.removeDestroidAsteroids();
        this.asteroids.forEach((ast) => {
            const newPos = Vector_1.default.add(ast.pos, ast.vel);
            const newY = newPos.y;
            if (newY + constants_1.GRID_SIZE > 600) {
                ast.destroy();
            }
            else {
                ast.pos = newPos;
            }
        });
    }
    removeDestroidAsteroids() {
        this.asteroids = this.asteroids.filter((ast) => !ast.isDestroyed());
    }
    setSequence(sequence) {
        if (!sequence) {
            return;
        }
        this._s = sequence;
        this.sequence = this.sequenceGenerator();
    }
    resetSequenceGenerator() {
        this.sequence = this.sequenceGenerator();
    }
    *sequenceGenerator() {
        let index = 0;
        if (this._s) {
            while (index < this._s.length) {
                yield this._s[index++];
            }
            return;
        }
    }
}
exports.default = AsteroidField;
