"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fn = exports.addOne = void 0;
async function addOne(a) {
    return a + 2;
}
exports.addOne = addOne;
function fn(n) {
    if (n > 5) {
        return true;
    }
    else {
        return false;
    }
}
exports.fn = fn;
