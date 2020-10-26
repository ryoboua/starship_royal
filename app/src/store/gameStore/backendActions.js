import {
    START_ROUND,
    KEY_DOWN,
    KEY_UP,
    ADD_PLAYER,
    PLAYER_DEAD,
    REMOVE_PLAYER,
    BACKEND_ADD_PLAYER,
    BACKEND_REMOVE_PLAYER,
    BACKEND_START_ROUND,
    BACKEND_KEY_DOWN,
    BACKEND_KEY_UP,
    BACKEND_PLAYER_DEAD,
} from "../../../appEvent";

export default {
    [BACKEND_ADD_PLAYER](context, player) {
        context.commit(ADD_PLAYER, player)
    },
    [BACKEND_REMOVE_PLAYER](context, socketId) {
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