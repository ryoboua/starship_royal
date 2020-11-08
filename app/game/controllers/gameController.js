"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStartRound = exports.gameHandleKeyUp = exports.gameHandleKeyDown = exports.handleDeadPlayer = exports.removePlayer = exports.addPlayer = exports.createGame = void 0;
const Game_1 = __importDefault(require("../classes/Game"));
const constants_1 = require("../constants");
const constants_2 = require("../constants");
const levels_1 = __importDefault(require("../levels"));
const appEvent_1 = require("../../appEvent");
const MAX_LEVEL = levels_1.default.length;
function createGame(players, context) {
    return Game_1.default.createGameState(players, context);
}
exports.createGame = createGame;
function addPlayer(game, player) {
    game.addPlayer(player);
    return game.getPlayerList();
}
exports.addPlayer = addPlayer;
function removePlayer(game, socketId) {
    game.removePlayer(socketId);
    return game.getPlayerList();
}
exports.removePlayer = removePlayer;
function handleDeadPlayer(game, socketId) {
    game.destroyShip(socketId);
}
exports.handleDeadPlayer = handleDeadPlayer;
function gameHandleKeyDown(game, keyCode, socketId) {
    const player = game.players[socketId];
    if (!player) {
        return;
    }
    player.keys.updateKeysDown(keyCode);
    player.updateVelocityKeyDown(keyCode);
}
exports.gameHandleKeyDown = gameHandleKeyDown;
function gameHandleKeyUp(game, keyCode, socketId) {
    const player = game.players[socketId];
    if (!player) {
        return;
    }
    player.keys.updateKeysUp(keyCode);
    player.updateVelocityKeyUp(keyCode);
}
exports.gameHandleKeyUp = gameHandleKeyUp;
async function handleStartRound(game, sequence) {
    if (game.isRoundActive()) {
        return;
    }
    let level = game.getCurrentLevel();
    if (level >= MAX_LEVEL) {
        console.log('end game');
        return;
    }
    level = levels_1.default[level];
    game.addLevel(level);
    const initialGameState = game.getGameState();
    game.commit(appEvent_1.LOAD_LEVEL, { level, initialGameState });
    startGameInterval(game, sequence);
}
exports.handleStartRound = handleStartRound;
function initiateCountdown(game) {
    return new Promise((resolve) => {
        let count = 5;
        const countdownIntervalId = setInterval(function () {
            if (count) {
                game.commit(appEvent_1.COUNTDOWN, `<h1>${count--}</h1>`);
            }
            else {
                clearInterval(countdownIntervalId);
                resolve();
            }
        }, 1000);
    });
}
function startGameInterval(game, sequence) {
    if (game.isRoundActive()) {
        return;
    }
    const { asteroidField, players, levels } = game;
    const { numOfAsteroids, asteroidFieldTimeInterval } = levels[levels.length - 1];
    if (sequence) {
        asteroidField.setSequence(sequence);
    }
    game.commit(appEvent_1.GAME_ACTIVE, true);
    game.setRoundStatus(true);
    const mainGameLoopIntervalId = setInterval(() => {
        const gameOverReason = game.gameLoop();
        if (!gameOverReason) {
            game.commit(appEvent_1.GAME_STATE_UPDATE, game.getGameState());
        }
        else {
            clearInterval(mainGameLoopIntervalId);
            clearInterval(asteroidFieldIntervalId);
            clearInterval(fireMissileIntervalId);
            clearInterval(gameTimerIntervalId);
            processGameOver(gameOverReason, game);
        }
    }, 1000 / constants_1.FRAME_RATE);
    const gameTimerIntervalId = setInterval(() => game.decrementTimer(), 1000);
    const asteroidFieldIntervalId = setInterval(() => {
        asteroidField.generateAsteroid(numOfAsteroids);
    }, asteroidFieldTimeInterval);
    const fireMissileIntervalId = setInterval(() => {
        Object.values(players).forEach((player) => {
            if (player.isAlive) {
                player.fireMissile();
            }
        });
    }, 150);
}
function processGameOver(gameOverReason, game) {
    if (!gameOverReason || !game) {
        return;
    }
    game.setRoundStatus(false);
    game.endRound();
    game.dispatch("endRound");
    game.commit(appEvent_1.GAME_ACTIVE, false);
    const currentLevel = game.getCurrentLevel();
    if (currentLevel < MAX_LEVEL) {
        const rawHtml = generateGameInfoRawHtml(gameOverReason);
        game.commit(appEvent_1.ROUND_OVER, rawHtml);
    }
    else {
        game.commit(appEvent_1.GAME_OVER, `
      <h1>GAME OVER</h1>
      <br>
      <h1>THANKS FOR PLAYING</h1>
    `);
    }
}
function generateGameInfoRawHtml(reason) {
    return `<h1>${constants_2.GAME_OVER_REASONS[reason]}</h1>`;
}
