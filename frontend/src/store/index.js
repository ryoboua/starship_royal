import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playerNumber: null,
    roomName: null,
    gameActive: false,
  },
  mutations: {
    setRoomName(state, roomName) {
      state.roomName = roomName
    },
    setPlayerNumber(state, num) {
      state.playerNumber = num
    },
    setGameActive(state, b) {
      state.gameActive = b
    },
    setPlayerScores(state, scores) {
      state.playerScores = scores
    },
  },
  actions: {
    SOCKET_NEW_GAME(context, gameInfo) {
      context.commit("setRoomName", gameInfo.roomName)
      context.commit("setPlayerNumber", gameInfo.playerNumber)
    },
    SOCKET_JOIN_GAME_ACCEPTED(context, gameInfo) {
      context.commit("setRoomName", gameInfo.roomName)
      context.commit("setPlayerNumber", gameInfo.playerNumber)
    },
    SOCKET_GAME_OVER(context, reason) {
      context.commit("setGameActive", false)
      console.log(reason)
    },
    SOCKET_GAME_ACTIVE(context, b) {
      context.commit("setGameActive", b)
    },
  },
  modules: {},
})
