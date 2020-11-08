import {
  SET_CLIENT,
  CREATE_GAME,
  JOIN_GAME,
} from "../../appEvent"

export default (socket) => ({
  namespaced: true,
  state: {
    name: "",
    playerNumber: null,
    host: null,
    roomName: null,
    socketId: null
  },
  mutations: {
    [SET_CLIENT](state, client) {
      state.name = client.name
      state.playerNumber = client.playerNumber
      state.host = client.host
      state.roomName = client.roomName
      state.socketId = client.socketId
    },
  },
  actions: {
    createGame(context, name) {
      if (context.rootState.game.type === 'single') {
        const client = { name, socketId: 'CQkNTGUIzzrQGVYuAAAB', roomName: 'local', playerNumber: 1, host: true }
        context.commit(SET_CLIENT, client)
        context.dispatch('game/createGame', [client], { root: true })
      }
      if (context.rootState.game.type === 'multi') {
        socket.emit(CREATE_GAME, name, (client) => {
          context.commit(SET_CLIENT, client)
          context.dispatch('game/createGame', [client], { root: true })
        });
      }
    },
    joinGame(context, nameAndRoomName) {
      if (context.rootState.game.type === 'multi') {
        socket.emit(JOIN_GAME, nameAndRoomName, (res, err) => {
          if (err) {
            return context.commit("modal/setAndShowModal", err, { root: true })
          } else if (res) {
            const { client, players } = res
            context.commit(SET_CLIENT, client)
            context.dispatch('game/createGame', players, { root: true })
          }
        });
      }
    },
  },
})
