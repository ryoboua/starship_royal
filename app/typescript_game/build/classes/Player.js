"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./Client"));
const Vector_1 = __importDefault(require("./Vector"));
const Keys_1 = __importDefault(require("./Keys"));
const Missiles_1 = __importDefault(require("./Missiles"));
const constants_1 = require("../constants");
class Player extends Client_1.default {
    constructor(client) {
        super({ ...client });
        this.score = 0;
        this.pos = new Vector_1.default(client.playerNumber * 200, 500);
        this.vel = new Vector_1.default(0, 0);
        this.keys = new Keys_1.default();
        this.weapons = new Missiles_1.default();
        this.isAlive = true;
        this.left = false;
        this.body = [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 1, 1, 1, 1]];
    }
    reset() {
        this.pos = new Vector_1.default(this.playerNumber * 200, 500);
        this.vel = new Vector_1.default(0, 0);
        this.keys = new Keys_1.default();
        this.weapons = new Missiles_1.default();
        this.isAlive = true;
    }
    selfDestruct() {
        this.isAlive = false;
    }
    updatePosition(asteroidField, isLocal) {
        const numOfDestroyedAsteroids = this.weapons.updateMissilePositions(asteroidField);
        if (numOfDestroyedAsteroids) {
            this.score += numOfDestroyedAsteroids * constants_1.ASTEROID_VALUE;
        }
        this.updateSpaceshipPosition(asteroidField, isLocal);
    }
    updateSpaceshipPosition(asteroidField, isLocal) {
        const newPos = Vector_1.default.add(this.pos, this.vel);
        const newX = newPos.getX();
        const newY = newPos.getY();
        if (newX - constants_1.GRID_SIZE < 0) {
            newPos.setX(newX + constants_1.SPACE_STEP);
        }
        if (newX + 2 * constants_1.GRID_SIZE > 1000) {
            newPos.setX(newX - constants_1.SPACE_STEP);
        }
        if (newY - constants_1.GRID_SIZE < 0) {
            newPos.setY(newY + constants_1.SPACE_STEP);
        }
        if (newY + constants_1.GRID_SIZE > 600) {
            newPos.setY(newY - constants_1.SPACE_STEP);
        }
        this.pos = newPos;
    }
    updateVelocityKeyDown(keyCode) {
        if (!keyCode) {
            return;
        }
        if (keyCode === 37 || keyCode === 65) {
            this.vel.setX(-constants_1.SPACE_STEP);
        }
        if (keyCode === 38 || keyCode === 87) {
            this.vel.setY(-constants_1.SPACE_STEP);
        }
        if (keyCode === 39 || keyCode === 68) {
            this.vel.setX(constants_1.SPACE_STEP);
        }
        if (keyCode === 40 || keyCode === 83) {
            this.vel.setY(constants_1.SPACE_STEP);
        }
    }
    updateVelocityKeyUp(keyCode) {
        if (!keyCode) {
            return;
        }
        if (keyCode === 37 || keyCode === 65) {
            this.vel.setX(this.keys.right ? constants_1.SPACE_STEP : 0);
        }
        if (keyCode === 38 || keyCode === 87) {
            this.vel.setY(this.keys.up ? constants_1.SPACE_STEP : 0);
        }
        if (keyCode === 39 || keyCode === 68) {
            this.vel.setX(this.keys.left ? -constants_1.SPACE_STEP : 0);
        }
        if (keyCode === 40 || keyCode === 83) {
            this.vel.setY(this.keys.down ? -constants_1.SPACE_STEP : 0);
        }
    }
    fireMissile() {
        if (this.keys.spacebar) {
            const x = this.left ? 1 : 3;
            this.left = !this.left;
            let y = 0;
            if (this.vel.y < 0) {
                y = -10;
            }
            const pos = Vector_1.default.add(this.pos, new Vector_1.default(x * constants_1.GRID_SIZE, y));
            this.weapons.generateMissile(pos);
        }
    }
}
exports.default = Player;
