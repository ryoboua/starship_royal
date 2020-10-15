export default {
  namespaced: true,
  state: {
    name: "",
    playerNumber: null,
    host: null,
    roomName: null,
  },
  mutations: {
    setClient(state, client) {
      state.name = client.name
      state.playerNumber = client.playerNumber
      state.host = client.host
      state.roomName = client.roomName
    },
  },
  actions: {
    SOCKET_NEW_GAME(context, client) {
      context.commit("setClient", client)
      context.commit("game/addPlayer", [client], { root: true })
    },
    SOCKET_JOIN_GAME_ACCEPTED(context, client) {
      context.commit("setClient", client)
    },
  },
}
