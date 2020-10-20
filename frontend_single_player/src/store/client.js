export default {
  namespaced: true,
  state: {
    name: "",
    playerNumber: null,
    host: null,
    roomName: null,
    socketId: null
  },
  mutations: {
    SET_CLIENT(state, client) {
      state.name = client.name
      state.playerNumber = client.playerNumber
      state.host = client.host
      state.roomName = client.roomName
      state.socketId = client.socketId
    },
  },
  actions: {
    SOCKET_NEW_GAME(context, client) {
      context.commit("SET_CLIENT", client)
      context.commit("game/ADD_PLAYER", [client], { root: true })
    },
    SOCKET_JOIN_GAME_ACCEPTED(context, client) {
      context.commit("SET_CLIENT", client)
    },
  },
}
