module.exports = {
    randomNumBetween: function (min: number, max: number): number {
        return min + Math.random() * (max - min)
    }
}