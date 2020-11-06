"use strict";
module.exports = {
    randomNumBetween: function (min, max) {
        return min + Math.random() * (max - min);
    }
};
