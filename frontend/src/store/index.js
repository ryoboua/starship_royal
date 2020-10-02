import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: "",
    playerNumber: null,
    roomName: null,
    gameActive: false,
    level: null,
    players: [],
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
    setName(state, name) {
      state.name = name
    },
    addPlayer(state, players) {
      state.players = players
    },
    removePlayer(state, players) {
      state.players = players
    },
  },
  actions: {
    SOCKET_NEW_GAME(context, client) {
      context.commit("setRoomName", client.roomName)
      context.commit("setPlayerNumber", client.playerNumber)
      context.commit("addPlayer", [client])
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
    SOCKET_PLAYER_ADDED(context, players) {
      context.commit("addPlayer", players)
    },
    SOCKET_PLAYER_REMOVED(context, players) {
      context.commit("removePlayer", players)
    },
  },
  modules: {},
})
