import {
    createGame,
    addPlayer,
    removePlayer,
    gameHandleKeyDown,
    gameHandleKeyUp,
    handleStartRound,
    handleDeadPlayer
} from "../../../game/controllers/gameController"
import Mutations from "../../../mutations"
const {
    SET_GAME_TYPE,
    CREATE_GAME,
    START_ROUND,
    LOAD_LEVEL,
    GAME_ACTIVE,
    GAME_STATE_UPDATE,
    KEY_DOWN,
    KEY_UP,
    COUNTDOWN,
    DISPLAY_MSG,
    ROUND_OVER,
    GAME_OVER,
    ADD_PLAYER,
    REMOVE_PLAYER,
    PLAYER_DEAD,
} = Mutations
import { GameType } from '../../../types'

export default {
    [SET_GAME_TYPE](state: { type: GameType }, type: GameType) {
        state.type = type
    },
    [CREATE_GAME](state, { players, context }) {
        state.players = players
        state._gameInstance = createGame(players, context)
    },
    [START_ROUND](state, sequence) {
        state.disableStartBtn = true
        handleStartRound(state._gameInstance, sequence)
    },
    [LOAD_LEVEL](state, { level, initialGameState }) {
        state.level = level;
        state.timer = initialGameState.timer;
        state.gameState = initialGameState
    },
    [GAME_ACTIVE](state, b) {
        state.gameActive = b
    },
    [GAME_STATE_UPDATE](state, gameState) {
        state.gameState = gameState
        state.playerScores = gameState.playerScores;
        state.timer = gameState.timer;
    },
    [KEY_DOWN](state, { keyCode, socketId }) {
        gameHandleKeyDown(state._gameInstance, keyCode, socketId)
    },
    [KEY_UP](state, { keyCode, socketId }) {
        gameHandleKeyUp(state._gameInstance, keyCode, socketId)
    },
    [COUNTDOWN](state, count) {
        state.screen = count
    },
    [DISPLAY_MSG](state, msg) {
        state.screen = msg
    },
    [ROUND_OVER](state, msg) {
        state.screen = msg
        state.disableStartBtn = false
    },
    [GAME_OVER](state, msg) {
        state.screen = msg
        state.disableStartBtn = false
    },
    [ADD_PLAYER](state, player) {
        state.players = addPlayer(state._gameInstance, player)
    },
    [REMOVE_PLAYER](state, socketId) {
        state.players = removePlayer(state._gameInstance, socketId)
    },
    [PLAYER_DEAD](state, socketId) {
        handleDeadPlayer(state._gameInstance, socketId)
    },
}