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
  },
}
