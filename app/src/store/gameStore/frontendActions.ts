import Mutations from "../../../shared/mutations"
import { ClientModel, GameActionContext, KeyEvent, PlayerPositionUpdate, KeyCodes } from "../../../shared/interfaces";
import { GameType, FrontendSocket } from "../../../shared/types";

const {
    SET_GAME_TYPE,
    CREATE_GAME,
    START_ROUND,
    KEY_DOWN,
    KEY_UP,
    DISPLAY_MSG,
    PLAYER_DEAD,
    END_ROUND,
    RESET_GAME_STORE,
    LEAVE_ROOM,
    PLAYER_POSITION_UPDATE,
    ROUND_OVER
} = Mutations

export default (socket: FrontendSocket) => ({
    createGame(context: GameActionContext, players: ClientModel) {
        context.commit(CREATE_GAME, { players, context })
    },

    startRound(context: GameActionContext) {
        if (context.state._gameInstance?.roundActive) {
            return
        }

        if (context.state.type === 'single') {
            context.commit(START_ROUND)
        }

        if (context.state.type === 'multi') {
            socket.emit(START_ROUND)
        }
    },

    roundOver(context: GameActionContext, screen: Screen) {
        context.commit(ROUND_OVER, screen)
    },

    emitEndRoundToBackend(context: GameActionContext) {
        if (context.state.type === 'multi' && context.rootState.client.host) {
            socket.emit(END_ROUND)
        }
    },

    handleKeyDown(context: GameActionContext, e: KeyboardEvent) {
        const keyCode = (<any>KeyCodes)[e.code]
        if (!keyCode) {
            return
        }

        const socketId = context.rootState.client.socketId
        const keyEvent: KeyEvent = { socketId, keyCode }

        if (context.state.type === 'multi' && context.state._gameInstance?.roundActive) {
            socket.emit(KEY_DOWN, keyEvent)
        }
        context.commit(KEY_DOWN, keyEvent)
    },

    handleKeyUp(context: GameActionContext, e: KeyboardEvent) {
        const keyCode = (<any>KeyCodes)[e.code]
        if (!keyCode) {
            return
        }

        const socketId = context.rootState.client.socketId
        const keyEvent: KeyEvent = { socketId, keyCode }

        if (context.state.type === 'multi' && context.state._gameInstance?.roundActive) {
            socket.emit(KEY_UP, keyEvent)
        }
        context.commit(KEY_UP, keyEvent)
    },

    broadcastPosition(context: GameActionContext, payload: PlayerPositionUpdate) {
        if (context.state.type === 'multi' && context.state._gameInstance?.roundActive) {
            socket.emit(PLAYER_POSITION_UPDATE, payload)
        }
    },

    displayMsg(context: GameActionContext, screen: Screen) {
        context.commit(DISPLAY_MSG, screen)
    },

    setGameType(context: GameActionContext, type: GameType) {
        context.commit(SET_GAME_TYPE, type)
    },

    playerDead(context: GameActionContext, socketId: string) {
        if (context.state.type === 'multi' && context.state._gameInstance?.roundActive) {
            socket.emit(PLAYER_DEAD, socketId)
        }
    },
    returnToStartMenu(context: GameActionContext) {
        if (context.state.type === 'multi') {
            socket.close()
        }
        context.commit(RESET_GAME_STORE)
        context.commit(`client/${LEAVE_ROOM}`, null, { root: true })
    }
})