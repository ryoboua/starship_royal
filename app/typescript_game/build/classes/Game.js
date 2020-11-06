"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const Lobby_1 = __importDefault(require("./Lobby"));
const Level_1 = __importDefault(require("./Level"));
const AsteroidField_1 = __importDefault(require("./AsteroidField"));
module.exports = class Game extends Lobby_1.default {
    constructor() {
        super();
        this.levels = [];
        this.asteroidField = new AsteroidField_1.default();
        this.gridsize = constants_1.GRID_SIZE;
        this.timer = constants_1.ROUND_TIME;
        this._context = null;
    }
    static createGameState(players, context) {
        const game = new Game();
        players.forEach(player => game.addPlayer(player));
        game.setFrontEndContext(context);
        return game;
    }
    resetState() {
        this.timer = constants_1.ROUND_TIME;
        this.asteroidField = new AsteroidField_1.default();
        Object.values(this.players).forEach((player) => player.reset());
    }
    setFrontEndContext(context) {
        this._context = context;
    }
    dispatch(eventName, data = null) {
        this._context.dispatch(eventName, data);
    }
    commit(eventName, data = null) {
        this._context.commit(eventName, data);
    }
    gameLoop() {
        this.asteroidField.updatePosition();
        Object.values(this.players).forEach((player) => {
            if (player.isAlive) {
                player.updatePosition(this.asteroidField, this.isLocal(player.socketId));
                if (!player.isAlive) {
                    this.dispatch("playerDead", player.socketId);
                }
            }
        });
        if (!Object.values(this.players).some((player) => player.isAlive)) {
            return 1;
        }
        return;
    }
    getGameState() {
        return {
            players: this.players,
            asteroidField: this.asteroidField,
            gridsize: this.gridsize,
            timer: this.timer,
            playerScores: this.getPlayerScores(),
        };
    }
    getPlayerScores() {
        return Object.values(this.players)
            .map((player) => ({
            name: player.name,
            score: player.score,
        }))
            .sort((a, b) => b.score - a.score);
    }
    addLevel(level) {
        level = new Level_1.default(level);
        this.levels.push(level);
    }
    decrementTimer() {
        if (!this.timer) {
            return;
        }
        this.timer--;
    }
    endRound() {
        this.resetState();
    }
    getCurrentLevel() {
        return this.levels.length;
    }
    destroyShip(socketId) {
        const player = this.players[socketId];
        if (!player) {
            return;
        }
        player.selfDestruct();
    }
    isLocal(socketId) {
        return this._context.rootState.client.socketId === socketId;
    }
};
