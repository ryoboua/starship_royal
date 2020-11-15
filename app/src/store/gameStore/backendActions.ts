import Mutations from "../../../shared/mutations"
import { ClientModel, GameActionContext, KeyEvent, PlayerPositionUpdate } from "../../../shared/interfaces";
import { FrontendSocket, Sequence } from "../../../shared/types";

const {
    START_ROUND,
    KEY_DOWN,
    KEY_UP,
    ADD_PLAYER,
    REMOVE_PLAYER,
    PLAYER_DEAD,
    PLAYER_POSITION_UPDATE,
    RESET_GAME_STORE,
    LEAVE_ROOM
} = Mutations

export default (socket: FrontendSocket) => ({
    BACKEND_addPlayer(context: GameActionContext, client: ClientModel) {
        context.commit(ADD_PLAYER, client)
    },

    BACKEND_removePlayer(context: GameActionContext, socketId: string) {
        context.commit(REMOVE_PLAYER, socketId)
    },

    BACKEND_startRound(context: GameActionContext, sequence: Sequence) {
        context.commit(START_ROUND, sequence)
    },

    BACKEND_keydown(context: GameActionContext, keyEvent: KeyEvent) {
        context.commit(KEY_DOWN, keyEvent)
    },

    BACKEND_keyup(context: GameActionContext, keyEvent: KeyEvent) {
        context.commit(KEY_UP, keyEvent)
    },

    BACKEND_playerDead(context: GameActionContext, socketId: string) {
        context.commit(PLAYER_DEAD, socketId)
    },

    BACKEND_playerPositionUpdate(context: GameActionContext, update: PlayerPositionUpdate) {
        context.commit(PLAYER_POSITION_UPDATE, update)
    },

    BACKEND_hostDisconnected(context: GameActionContext) {
        context.commit(RESET_GAME_STORE)
        context.commit(`client/${LEAVE_ROOM}`, null, { root: true })
    }
})