const {
  createGame,
  addPlayer,
  removePlayer,
  gameHandleKeyDown,
  gameHandleKeyUp,
  handleStartRound,
  isRoundActive
} = require("../game/gameController")

export default {
  namespaced: true,
  state: {
    gameActive: false,
    players: [],
    game: null,
    gameState: null,
    type: 'single',
    level: {},
    timer: null,
    playerScores: []
  },
  mutations: {
    CREATE_GAME(state, { client, emit }) {
      state.game = createGame(client, emit)
    },
    START_ROUND(state) {
      handleStartRound(state.game)
    },
    LOAD_LEVEL(state, { level, initialGameState }) {
      state.level = level;
      state.timer = initialGameState.timer;
      state.gameState = initialGameState
    },
    GAME_ACTIVE(state, b) {
      state.gameActive = b
    }
    ,
    GAME_STATE_UPDATE(state, gameState) {
      state.gameState = gameState
      state.playerScores = gameState.playerScores;
      state.timer = gameState.timer;
    },
    KEY_DOWN(state, { keyCode, socketId }) {
      gameHandleKeyDown(state.game, keyCode, socketId)
    },
    KEY_UP(state, { keyCode, socketId }) {
      gameHandleKeyUp(state.game, keyCode, socketId)
    },
    COUNTDOWN(state) {

    }
  },
  actions: {
    createSinglePlayerGame(context) {
      const client = { socketId: 'weuf9qwhfp9e', name: "Joe Doe", roomName: 'local', playerNumber: 1, host: true }
      const emit = (eventName, data = null) => context.commit(eventName, data)
      context.commit("client/SET_CLIENT", client, { root: true })
      context.commit("CREATE_GAME", { client, emit })
    },
    startRound(context) {
      context.commit("START_ROUND")
    },
    handleKeyDown(context, keyCode) {
      const socketId = context.rootState.client.socketId
      context.commit("KEY_DOWN", { keyCode, socketId })
    },
    handleKeyUp(context, keyCode) {
      const socketId = context.rootState.client.socketId
      context.commit("KEY_UP", { keyCode, socketId })
    }
  },
}
