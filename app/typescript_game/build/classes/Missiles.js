"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Missile_1 = __importDefault(require("./Missile"));
const Vector_1 = __importDefault(require("./Vector"));
const constants_1 = require("../constants");
class Missiles {
    constructor() {
        this.missiles = [];
    }
    generateMissile(pos) {
        this.missiles.push(new Missile_1.default(pos));
    }
    updateMissilePositions(asteroidField) {
        if (!this.missiles.length) {
            return;
        }
        const missilesToRemove = [];
        this.missiles.forEach((mis, missileIndex) => {
            const newPos = Vector_1.default.sub(mis.pos, mis.vel);
            const newY = newPos.y;
            const newX = newPos.x;
            asteroidField.asteroids.forEach((ast, asteroidIndex) => {
                const body = ast.body;
                for (let y = 0; y < body.length; y++) {
                    for (let x = 0; x < body[y].length; x++) {
                        if (body[y][x]) {
                            const posY = (y * constants_1.GRID_SIZE) + ast.pos.y;
                            const posX = (x * constants_1.GRID_SIZE) + ast.pos.x;
                            if (newX < posX + constants_1.GRID_SIZE &&
                                newX + constants_1.GRID_SIZE > posX &&
                                newY < posY + constants_1.GRID_SIZE &&
                                newY + constants_1.GRID_SIZE > posY) {
                                ast.breakPiece(y, x);
                                missilesToRemove.push(missileIndex);
                            }
                        }
                    }
                }
            });
            if (newY - constants_1.GRID_SIZE < 0) {
                if (!missilesToRemove.includes(missileIndex)) {
                    missilesToRemove.push(missileIndex);
                }
            }
            else {
                mis.pos = newPos;
            }
        });
        this.removeMissiles(missilesToRemove);
        return;
    }
    removeMissiles(missArr) {
        this.missiles = this.missiles.filter((mis, i) => !missArr.includes(i));
    }
}
exports.default = Missiles;
