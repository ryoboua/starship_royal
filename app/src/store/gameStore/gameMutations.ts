import {
    createGame,
    addPlayer,
    removePlayer,
    gameHandleKeyDown,
    gameHandleKeyUp,
    handleStartRound,
    handleDeadPlayer,
    handlePlayerPositionUpdate
} from "../../../game/controllers/gameController"
import {
    GameStore,
    GameState,
    ClientModel,
    KeyEvent,
    Level,
    GameActionContext,
    PlayerPositionUpdate
} from "../../../shared/interfaces"
import { GameType, Sequence } from '../../../shared/types'
import Mutations from "../../../shared/mutations"
import getDefaultState from "./gameState";
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
    RESET_GAME_STORE,
    PLAYER_POSITION_UPDATE
} = Mutations

export default {
    [SET_GAME_TYPE](state: GameStore, type: GameType) {
        state.type = type
    },

    [CREATE_GAME](state: GameStore, { players, context }: { players: ClientModel[], context: GameActionContext }) {
        state.players = players
        state._gameInstance = createGame(players, context)
    },

    [START_ROUND](state: GameStore, sequence: Sequence) {
        if (!state._gameInstance) {
            return
        }
        state.disableStartBtn = true
        state.screen = { msg: '', reason: '', winner: '' }
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

    [KEY_DOWN](state: GameStore, keyEvent: KeyEvent) {
        if (!state._gameInstance) {
            return
        }
        gameHandleKeyDown(state._gameInstance, keyEvent)
    },

    [KEY_UP](state: GameStore, keyEvent: KeyEvent) {
        if (!state._gameInstance) {
            return
        }
        gameHandleKeyUp(state._gameInstance, keyEvent)
    },

    [COUNTDOWN](state: GameStore, screen: Screen) {
        state.screen = { ...state.screen, ...screen }
    },

    [DISPLAY_MSG](state: GameStore, screen: Screen) {
        state.screen = { ...state.screen, ...screen }
    },

    [ROUND_OVER](state: GameStore, screen: Screen) {
        state.screen = { ...state.screen, ...screen }
        state.disableStartBtn = false
    },

    [GAME_OVER](state: GameStore, screen: Screen) {
        state.screen = { ...state.screen, ...screen }
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

    [PLAYER_POSITION_UPDATE](state: GameStore, update: PlayerPositionUpdate) {
        if (!state._gameInstance) {
            return
        }
        handlePlayerPositionUpdate(state._gameInstance, update)
    },

    [RESET_GAME_STORE](state: GameStore) {
        Object.assign(state, getDefaultState())
    }
}