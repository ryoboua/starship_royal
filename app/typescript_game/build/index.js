"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backman_1 = require("./utils/backman");
let t;
const num = backman_1.addOne(7).then(x => console.log(x === t));
backman_1.fn(8);
