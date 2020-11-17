import { FrontendSocket } from "../../shared/types"
import { ClientModel, ClientStore, Modal, RootState, joinGameResponse } from "../../shared/interfaces";
import Mutations from "../../shared/mutations"
import { ActionContext } from "vuex";
import { SHIP_COLOURS } from "../../game/constants";

const {
  SET_CLIENT,
  CREATE_GAME,
  JOIN_GAME,
  LEAVE_ROOM
} = Mutations

const state: ClientStore = {
  name: "",
  playerNumber: 1,
  host: null,
  roomName: '',
  socketId: '',
  color: ''
}

export default (socket: FrontendSocket) => ({
  namespaced: true,
  state,
  mutations: {
    [SET_CLIENT](state: ClientStore, client: ClientModel) {
      state.name = client.name
      state.playerNumber = client.playerNumber
      state.host = client.host
      state.roomName = client.roomName
      state.socketId = client.socketId
      state.color = client.color
    },
    [LEAVE_ROOM](state: ClientStore) {
      state.roomName = ''
      state.playerNumber = 1
      state.host = null
      state.roomName = ''
      state.socketId = ''
      state.color = ''
    },
  },
  actions: {
    createGame(context: ActionContext<ClientModel, RootState>, name: string) {
      if (context.rootState.game.type === 'single') {
        const client = { name, socketId: 'CQkNTGUIzzrQGVYuAAAB', roomName: 'local', playerNumber: 1, host: true, color: SHIP_COLOURS[0] }
        context.commit(SET_CLIENT, client)
        context.dispatch('game/createGame', [client], { root: true })
      }
      if (context.rootState.game.type === 'multi') {
        socket.emit(CREATE_GAME, name, (client: ClientModel) => {
          context.commit(SET_CLIENT, client)
          context.dispatch('game/createGame', [client], { root: true })
        });
      }
    },
    joinGame(context: ActionContext<ClientModel, RootState>, nameAndRoomName: { name: string, roomName: string }) {
      if (context.rootState.game.type === 'multi') {
        socket.emit(JOIN_GAME, nameAndRoomName, (payload: joinGameResponse, err: Modal) => {
          if (err) {
            context.commit("modal/setAndShowModal", err, { root: true })
          } else if (payload) {
            const { client, players } = payload
            context.commit(SET_CLIENT, client)
            context.dispatch('game/createGame', players, { root: true })
          }
        });
      }
    },
  },
})
