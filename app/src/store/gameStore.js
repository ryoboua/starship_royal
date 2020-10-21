const {
  createGame,
  addPlayer,
  removePlayer,
  gameHandleKeyDown,
  gameHandleKeyUp,
  handleStartRound,
  isRoundActive
} = require("../../game/controllerFrontend")


export default (socket) => ({
  namespaced: true,
  state: {
    gameActive: false,
    game: null,
    gameState: null,
    type: 'single',
    level: {},
    timer: null,
    players: [],
    playerScores: [],
    screen: '',
    disableStartBtn: false,
  },
  mutations: {
    SET_GAME_TYPE(state, type) {
      state.type = type
    },
    CREATE_GAME(state, { players, emit }) {
      state.players = players
      state.game = createGame(players, emit)
    },
    START_ROUND(state) {
      state.disableStartBtn = true
      handleStartRound(state.game)
    },
    LOAD_LEVEL(state, { level, initialGameState }) {
      state.level = level;
      state.timer = initialGameState.timer;
      state.gameState = initialGameState
    },
    GAME_ACTIVE(state, b) {
      state.gameActive = b
    },
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
    COUNTDOWN(state, count) {
      state.screen = count
    },
    DISPLAY_MSG(state, msg) {
      state.screen = msg
    },
    ROUND_OVER(state, msg) {
      state.screen = msg
      state.disableStartBtn = false
    },
    GAME_OVER(state, msg) {
      state.screen = msg
      state.disableStartBtn = false
    },
    ADD_PLAYER(state, player) {
      state.players = addPlayer(state.game, player)
    },
    REMOVE_PLAYER(state, socketId) {
      state.players = removePlayer(state.game, socketId)
    },
  },
  actions: {
    createSinglePlayerGame(context) {
      const client = { socketId: 'weuf9qwhfp9e', name: "Joe Doe", roomName: 'local', playerNumber: 1, host: true }
      const emit = (eventName, data = null) => context.commit(eventName, data)
      context.commit("client/SET_CLIENT", client, { root: true })
      context.commit("CREATE_GAME", { players: [client], emit })
    },
    startRound(context) {
      if (context.state.type === 'single') {
        context.commit("START_ROUND")
      }

      if (context.state.type === 'multi') {
        socket.emit("START_GAME")
      }
    },
    handleKeyDown(context, keyCode) {
      const socketId = context.rootState.client.socketId
      context.commit("KEY_DOWN", { keyCode, socketId })
    },
    handleKeyUp(context, keyCode) {
      const socketId = context.rootState.client.socketId
      context.commit("KEY_UP", { keyCode, socketId })
    },
    displayMsg(context, msg) {
      context.commit("DISPLAY_MSG", msg)
    },
    setGameType(context, type) {
      context.commit("SET_GAME_TYPE", type)
    },

    ////SOCKET EVENTS
    SOCKET_NEW_GAME(context, client) {
      context.commit("client/SET_CLIENT", client, { root: true })
      const emit = (eventName, data = null) => context.commit(eventName, data)
      context.commit("CREATE_GAME", { players: [client], emit })
    },
    SOCKET_JOIN_GAME_ACCEPTED(context, { client, players }) {
      context.commit("client/SET_CLIENT", client, { root: true })
      const emit = (eventName, data = null) => context.commit(eventName, data)
      context.commit("CREATE_GAME", { players, emit })
    },
    SOCKET_GAME_ACTIVE(context, b) {
      //context.commit("setGameActive", b)
    },
    SOCKET_PLAYER_ADDED(context, player) {
      context.commit("ADD_PLAYER", player)
    },
    SOCKET_PLAYER_REMOVED(context, socketId) {
      context.commit("REMOVE_PLAYER", socketId)
    },
    SOCKET_START_ROUND(context) {
      context.commit("START_ROUND")
    }
  },
}
)