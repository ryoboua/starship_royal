import {
    createGame,
    addPlayer,
    removePlayer,
    gameHandleKeyDown,
    gameHandleKeyUp,
    handleStartRound,
    handleDeadPlayer
} from "../../../game/controllers/gameController"
import { GameType, Sequence } from '../../../types'
import { GameStore, GameState, ClientModel, KeyEvent, Level, StoreContext } from "../../../interfaces"
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

export default {
    [SET_GAME_TYPE](state: GameStore, type: GameType) {
        state.type = type
    },
    [CREATE_GAME](state: GameStore, { players, context }: { players: ClientModel[], context: StoreContext }) {
        state.players = players
        state._gameInstance = createGame(players, context)
    },
    [START_ROUND](state: GameStore, sequence: Sequence) {
        if (!state._gameInstance) {
            return
        }
        state.disableStartBtn = true
        handleStartRound(state._gameInstance, sequence)
    },
    [LOAD_LEVEL](state: GameStore, { level, initialGameState }: { level: Level, initialGameState: GameState }) {
        state.level = level;
        state.timer = initialGameState.timer;
        state.gameState = initialGameState
    },
    [GAME_ACTIVE](state: GameStore, b: boolean) {
        state.gameActive = b
    },
    [GAME_STATE_UPDATE](state: GameStore, gameState: GameState) {
        state.gameState = gameState
        state.playerScores = gameState.playerScores;
        state.timer = gameState.timer;
    },
    [KEY_DOWN](state: GameStore, { keyCode, socketId }: KeyEvent) {
        if (!state._gameInstance) {
            return
        }
        gameHandleKeyDown(state._gameInstance, keyCode, socketId)
    },
    [KEY_UP](state: GameStore, { keyCode, socketId }: KeyEvent) {
        if (!state._gameInstance) {
            return
        }
        gameHandleKeyUp(state._gameInstance, keyCode, socketId)
    },
    [COUNTDOWN](state: GameStore, count: string) {
        state.screen = count
    },
    [DISPLAY_MSG](state: GameStore, msg: string) {
        state.screen = msg
    },
    [ROUND_OVER](state: GameStore, msg: string) {
        state.screen = msg
        state.disableStartBtn = false
    },
    [GAME_OVER](state: GameStore, msg: string) {
        state.screen = msg
        state.disableStartBtn = false
    },
    [ADD_PLAYER](state: GameStore, player: ClientModel) {
        if (!state._gameInstance) {
            return
        }
        state.players = addPlayer(state._gameInstance, player)
    },
    [REMOVE_PLAYER](state: GameStore, socketId: string) {
        if (!state._gameInstance) {
            return
        }
        state.players = removePlayer(state._gameInstance, socketId)
    },
    [PLAYER_DEAD](state: GameStore, socketId: string) {
        if (!state._gameInstance) {
            return
        }
        handleDeadPlayer(state._gameInstance, socketId)
    },
}