
import { GameStore } from "./../../../shared/interfaces"

export default (): GameStore => ({
    _gameInstance: null,
    gameActive: false,
    gameState: null,
    type: 'single',
    level: {},
    timer: null,
    players: [],
    playerScores: [],
    screen: {},
    disableStartBtn: false,
})