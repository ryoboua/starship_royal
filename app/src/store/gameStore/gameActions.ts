import Mutations from "../../../shared/mutations"
import { ClientModel, GameActionContext, BackendCommit } from "../../../shared/interfaces";
import { GameType, FrontendSocket } from "../../../shared/types";

const {
    SET_GAME_TYPE,
    CREATE_GAME,
    START_ROUND,
    KEY_DOWN,
    KEY_UP,
    DISPLAY_MSG,
    PLAYER_DEAD,
    END_ROUND
} = Mutations

export default (socket: FrontendSocket) => ({
    BACKEND_ACTION(context: GameActionContext, { mutation, data }: BackendCommit) {
        context.commit(mutation, data)
    },
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
    endRound(context: GameActionContext) {
        if (context.state.type === 'multi' && context.rootState.client.host) {
            socket.emit(END_ROUND)
        }
    },
    handleKeyDown(context: GameActionContext, keyCode: number) {
        const socketId = context.rootState.client.socketId
        if (context.state.type === 'multi' && context.state._gameInstance?.roundActive) {
            socket.emit(KEY_DOWN, keyCode)
        }
        context.commit(KEY_DOWN, { keyCode, socketId })

    },
    handleKeyUp(context: GameActionContext, keyCode: number) {
        const socketId = context.rootState.client.socketId
        if (context.state.type === 'multi' && context.state._gameInstance?.roundActive) {
            socket.emit(KEY_UP, keyCode)
        }
        context.commit(KEY_UP, { keyCode, socketId })

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
})