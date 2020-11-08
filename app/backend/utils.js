"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeid = void 0;
exports.makeid = (length) => {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
