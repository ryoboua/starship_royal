export default {
    namespaced: true,
    state: {
      gameActive: false,
      level: null,
      players: [],
    },
    mutations: {
      setGameActive(state, b) {
        state.gameActive = b
      },
      setPlayerScores(state, scores) {
        state.playerScores = scores
      },
      addPlayer(state, players) {
        state.players = players
      },
      removePlayer(state, players) {
        state.players = players
      },
    },
    actions: {
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
  }
  