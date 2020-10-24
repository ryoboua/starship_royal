import {
    SET_GAME_TYPE,
    CREATE_GAME,
    START_ROUND,
    KEY_DOWN,
    KEY_UP,
    DISPLAY_MSG,
    PLAYER_DEAD,
    END_ROUND
} from "../../../appEvent"

export default (socket) => ({
    createSinglePlayerGame(context, name) {
        const client = { name, socketId: 'CQkNTGUIzzrQGVYuAAAB', roomName: 'local', playerNumber: 1, host: true }
        context.commit("client/SET_CLIENT", client, { root: true })
        context.commit(CREATE_GAME, { players: [client], context })
    },
    startRound(context) {
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
    endRound(context) {
        if (context.state.type === 'multi' && context.rootState.client.host) {
            socket.emit(END_ROUND)
        }
    },
    handleKeyDown(context, keyCode) {
        const socketId = context.rootState.client.socketId
        if (context.state.type === 'multi' && context.state._gameInstance.isRoundActive()) {
            socket.emit(KEY_DOWN, keyCode)
        }
        context.commit(KEY_DOWN, { keyCode, socketId })

    },
    handleKeyUp(context, keyCode) {
        const socketId = context.rootState.client.socketId
        if (context.state.type === 'multi' && context.state._gameInstance.isRoundActive()) {
            socket.emit(KEY_UP, keyCode)
        }
        context.commit(KEY_UP, { keyCode, socketId })

    },
    displayMsg(context, msg) {
        context.commit(DISPLAY_MSG, msg)
    },
    setGameType(context, type) {
        context.commit(SET_GAME_TYPE, type)
    },
    playerDead(context, socketId) {
        if (context.state.type === 'multi' && context.state._gameInstance.isRoundActive()) {
            socket.emit(PLAYER_DEAD, socketId)
        }
    },
})