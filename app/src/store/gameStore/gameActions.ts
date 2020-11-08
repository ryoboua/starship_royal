import {
    SET_GAME_TYPE,
    CREATE_GAME,
    START_ROUND,
    KEY_DOWN,
    KEY_UP,
    DISPLAY_MSG,
    PLAYER_DEAD,
    END_ROUND
} from "../../../appEvents"

import { ClientModel, StoreContext } from "../../../interfaces";
import { GameType, SocketType as Socket } from "../../../types";


export default (socket: Socket) => ({
    BACKEND_ACTION(context: StoreContext, { mutation, data }) {
        context.commit(mutation, data)
    },
    createGame(context: StoreContext, players: ClientModel) {
        context.commit(CREATE_GAME, { players, context })
    },
    startRound(context: StoreContext) {
        if (context.state._gameInstance.isRoundActive()) {
            return
        }

        if (context.state.type === 'single') {
            context.commit(START_ROUND)
        }

        if (context.state.type === 'multi') {
            socket.emit(START_ROUND)
        }
    },
    endRound(context: StoreContext) {
        if (context.state.type === 'multi' && context.rootState.client.host) {
            socket.emit(END_ROUND)
        }
    },
    handleKeyDown(context: StoreContext, keyCode: number) {
        const socketId = context.rootState.client.socketId
        if (context.state.type === 'multi' && context.state._gameInstance.isRoundActive()) {
            socket.emit(KEY_DOWN, keyCode)
        }
        context.commit(KEY_DOWN, { keyCode, socketId })

    },
    handleKeyUp(context: StoreContext, keyCode: number) {
        const socketId = context.rootState.client.socketId
        if (context.state.type === 'multi' && context.state._gameInstance.isRoundActive()) {
            socket.emit(KEY_UP, keyCode)
        }
        context.commit(KEY_UP, { keyCode, socketId })

    },
    displayMsg(context: StoreContext, msg) {
        context.commit(DISPLAY_MSG, msg)
    },
    setGameType(context: StoreContext, type: GameType) {
        context.commit(SET_GAME_TYPE, type)
    },
    playerDead(context: StoreContext, socketId: string) {
        if (context.state.type === 'multi' && context.state._gameInstance.isRoundActive()) {
            socket.emit(PLAYER_DEAD, socketId)
        }
    },
})