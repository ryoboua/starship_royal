"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumBetween = void 0;
function randomNumBetween(min, max) {
    return min + Math.random() * (max - min);
}
exports.randomNumBetween = randomNumBetween;
