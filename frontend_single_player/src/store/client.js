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
  },
}
