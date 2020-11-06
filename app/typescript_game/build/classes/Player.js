"use strict";
const Client = require("./Client");
const Vector = require("./Vector");
const Keys = require("./Keys");
const Missiles = require("./Missiles");
const { GRID_SIZE, SPACE_STEP, ASTEROID_VALUE } = require("../constants");
module.exports = class Player extends Client {
    constructor(client) {
        super({ ...client });
        this.score = 0;
        this.pos = new Vector(client.playerNumber * 200, 500);
        this.vel = new Vector(0, 0);
        this.keys = new Keys();
        this.weapons = new Missiles();
        this.isAlive = true;
        this.left = false;
        this.body = [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 1, 1, 1, 1]];
    }
    reset() {
        this.pos = new Vector(this.playerNumber * 200, 500);
        this.vel = new Vector(0, 0);
        this.keys = new Keys();
        this.weapons = new Missiles();
        this.isAlive = true;
    }
    selfDestruct() {
        this.isAlive = false;
    }
    updatePosition(asteroidField, isLocal) {
        const numOfDestroyedAsteroids = this.weapons.updateMissilePositions(asteroidField);
        if (numOfDestroyedAsteroids) {
            this.score += numOfDestroyedAsteroids * ASTEROID_VALUE;
        }
        this.updateSpaceshipPosition(asteroidField, isLocal);
    }
    updateSpaceshipPosition(asteroidField, isLocal) {
        const newPos = Vector.add(this.pos, this.vel);
        const newX = newPos.getX();
        const newY = newPos.getY();
        if (newX - GRID_SIZE < 0) {
            newPos.setX(newX + SPACE_STEP);
        }
        if (newX + 2 * GRID_SIZE > 1000) {
            newPos.setX(newX - SPACE_STEP);
        }
        if (newY - GRID_SIZE < 0) {
            newPos.setY(newY + SPACE_STEP);
        }
        if (newY + GRID_SIZE > 600) {
            newPos.setY(newY - SPACE_STEP);
        }
        this.pos = newPos;
    }
    updateVelocityKeyDown(keyCode) {
        if (!keyCode) {
            return;
        }
        if (keyCode === 37 || keyCode === 65) {
            this.vel.setX(-SPACE_STEP);
        }
        if (keyCode === 38 || keyCode === 87) {
            this.vel.setY(-SPACE_STEP);
        }
        if (keyCode === 39 || keyCode === 68) {
            this.vel.setX(SPACE_STEP);
        }
        if (keyCode === 40 || keyCode === 83) {
            this.vel.setY(SPACE_STEP);
        }
    }
    updateVelocityKeyUp(keyCode) {
        if (!keyCode) {
            return;
        }
        if (keyCode === 37 || keyCode === 65) {
            this.vel.setX(this.keys.right ? SPACE_STEP : 0);
        }
        if (keyCode === 38 || keyCode === 87) {
            this.vel.setY(this.keys.up ? SPACE_STEP : 0);
        }
        if (keyCode === 39 || keyCode === 68) {
            this.vel.setX(this.keys.left ? -SPACE_STEP : 0);
        }
        if (keyCode === 40 || keyCode === 83) {
            this.vel.setY(this.keys.down ? -SPACE_STEP : 0);
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
            const pos = Vector.add(this.pos, new Vector(x * GRID_SIZE, y));
            this.weapons.generateMissile(pos);
        }
    }
};
