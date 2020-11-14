import Mutations from "../../../shared/mutations"
import { ClientModel, GameActionContext, KeyEvent } from "../../../shared/interfaces";
import { GameType, FrontendSocket } from "../../../shared/types";
import { GAME_OVER_REASONS } from "../../../game/constants";

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
    GAME_ACTIVE,
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
        if (e.repeat) {
            return
        }
        const socketId = context.rootState.client.socketId
        const keyEvent: KeyEvent = { socketId, keyCode: e.keyCode }

        context.commit(KEY_DOWN, keyEvent)

        if (context.state.type === 'multi' && context.state._gameInstance?.roundActive) {
            keyEvent.pos = context.state._gameInstance.getPlayerPosition(socketId)
            socket.emit(KEY_DOWN, keyEvent)
        }

    },

    handleKeyUp(context: GameActionContext, e: KeyboardEvent) {
        if (e.repeat) {
            return
        }
        const socketId = context.rootState.client.socketId
        const keyEvent: KeyEvent = { socketId, keyCode: e.keyCode }

        context.commit(KEY_UP, keyEvent)

        if (context.state.type === 'multi' && context.state._gameInstance?.roundActive) {
            socket.emit(KEY_UP, keyEvent)
        }
    },

    displayMsg(context: GameActionContext, msg: string) {
        context.commit(DISPLAY_MSG, msg)
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