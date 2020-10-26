import {
    CREATE_GAME,
    START_ROUND,
    KEY_DOWN,
    KEY_UP,
    ADD_PLAYER,
    REMOVE_PLAYER,
    BACKEND_CREATE_GAME,
    BACKEND_JOIN_GAME_ACCEPTED,
    BACKEND_GAME_ACTIVE,
    BACKEND_PLAYER_ADDED,
    BACKEND_PLAYER_REMOVED,
    BACKEND_START_ROUND,
    BACKEND_KEY_DOWN,
    BACKEND_KEY_UP,
    BACKEND_PLAYER_DEAD,
    PLAYER_DEAD,
} from "../../../appEvent";

export default {
    [BACKEND_CREATE_GAME](context, client) {
        context.commit("client/SET_CLIENT", client, { root: true })
        context.commit(CREATE_GAME, { players: [client], context })
    },
    [BACKEND_JOIN_GAME_ACCEPTED](context, { client, players }) {
        context.commit("client/SET_CLIENT", client, { root: true })
        context.commit(CREATE_GAME, { players, context })
    },
    [BACKEND_GAME_ACTIVE](context, b) {
        //context.commit("setGameActive", b)
    },
    [BACKEND_PLAYER_ADDED](context, player) {
        context.commit(ADD_PLAYER, player)
    },
    [BACKEND_PLAYER_REMOVED](context, socketId) {
        context.commit(REMOVE_PLAYER, socketId)
    },
    [BACKEND_START_ROUND](context, sequence) {
        context.commit(START_ROUND, sequence)
    },
    [BACKEND_KEY_DOWN](context, res) {
        context.commit(KEY_DOWN, res)
    },
    [BACKEND_KEY_UP](context, res) {
        context.commit(KEY_UP, res)
    },
    [BACKEND_PLAYER_DEAD](context, socketId) {
        context.commit(PLAYER_DEAD, socketId)
    },
}