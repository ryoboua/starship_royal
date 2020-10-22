const {
  createGame,
  addPlayer,
  removePlayer,
  gameHandleKeyDown,
  gameHandleKeyUp,
  handleStartRound,
  handleDeadPlayer
} = require("../../game/controllers/frontendController")
const {
  SET_GAME_TYPE,
  CREATE_GAME,
  START_ROUND,
  START_GAME,
  LOAD_LEVEL,
  GAME_ACTIVE,
  GAME_STATE_UPDATE,
  KEY_DOWN,
  KEY_UP,
  COUNTDOWN,
  DISPLAY_MSG,
  ROUND_OVER,
  GAME_OVER,
  ADD_PLAYER,
  REMOVE_PLAYER,
  BACKEND_NEW_GAME,
  BACKEND_JOIN_GAME_ACCEPTED,
  BACKEND_GAME_ACTIVE,
  BACKEND_PLAYER_ADDED,
  BACKEND_PLAYER_REMOVED,
  BACKEND_START_ROUND,
  BACKEND_KEY_DOWN,
  BACKEND_KEY_UP,
  BACKEND_PLAYER_DEAD,
  PLAYER_DEAD,
} = require("../../appEvent");

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
    [SET_GAME_TYPE](state, type) {
      state.type = type
    },
    [CREATE_GAME](state, { players, context }) {
      state.players = players
      state.game = createGame(players, context)
    },
    [START_ROUND](state) {
      state.disableStartBtn = true
      handleStartRound(state.game)
    },
    [LOAD_LEVEL](state, { level, initialGameState }) {
      state.level = level;
      state.timer = initialGameState.timer;
      state.gameState = initialGameState
    },
    [GAME_ACTIVE](state, b) {
      state.gameActive = b
    },
    [GAME_STATE_UPDATE](state, gameState) {
      state.gameState = gameState
      state.playerScores = gameState.playerScores;
      state.timer = gameState.timer;
    },
    [KEY_DOWN](state, { keyCode, socketId }) {
      gameHandleKeyDown(state.game, keyCode, socketId)
    },
    [KEY_UP](state, { keyCode, socketId }) {
      gameHandleKeyUp(state.game, keyCode, socketId)
    },
    [COUNTDOWN](state, count) {
      state.screen = count
    },
    [DISPLAY_MSG](state, msg) {
      state.screen = msg
    },
    [ROUND_OVER](state, msg) {
      state.screen = msg
      state.disableStartBtn = false
    },
    [GAME_OVER](state, msg) {
      state.screen = msg
      state.disableStartBtn = false
    },
    [ADD_PLAYER](state, player) {
      state.players = addPlayer(state.game, player)
    },
    [REMOVE_PLAYER](state, socketId) {
      state.players = removePlayer(state.game, socketId)
    },
    [PLAYER_DEAD](state, socketId) {
      handleDeadPlayer(state.game, socketId)
    },
  },
  actions: {
    createSinglePlayerGame(context) {
      const client = { socketId: 'weuf9qwhfp9e', name: "Joe Doe", roomName: 'local', playerNumber: 1, host: true }
      context.commit("client/SET_CLIENT", client, { root: true })
      context.commit(CREATE_GAME, { players: [client], context })
    },
    startRound(context) {
      if (context.state.type === 'single') {
        context.commit(START_ROUND)
      }

      if (context.state.type === 'multi') {
        socket.emit(START_GAME)
      }
    },
    handleKeyDown(context, keyCode) {
      const socketId = context.rootState.client.socketId
      if (context.state.type === 'multi' && context.state.game.isRoundActive()) {
        socket.emit(KEY_DOWN, keyCode)
      }
      context.commit(KEY_DOWN, { keyCode, socketId })

    },
    handleKeyUp(context, keyCode) {
      const socketId = context.rootState.client.socketId
      if (context.state.type === 'multi' && context.state.game.isRoundActive()) {
        socket.emit(KEY_UP, keyCode)
      }
      context.commit(KEY_UP, { keyCode, socketId })

    },
    displayMsg(context, msg) {
      context.commit(DISPLAY_MSG, msg)
    },
    setGameType(context, type) {
      context.commit(SET_GAME_TYPE, type)
    },

    [PLAYER_DEAD](context, socketId) {
      if (context.state.type === 'multi' && context.state.game.isRoundActive()) {
        socket.emit(PLAYER_DEAD, socketId)
      }
    },

    ////BACKEND EVENTS
    [BACKEND_NEW_GAME](context, client) {
      context.commit("client/SET_CLIENT", client, { root: true })
      context.commit(CREATE_GAME, { players: [client], context })
    },
    [BACKEND_JOIN_GAME_ACCEPTED](context, { client, players }) {
      context.commit("client/SET_CLIENT", client, { root: true })
      context.commit(CREATE_GAME, { players, context })
    },
    [BACKEND_GAME_ACTIVE](context, b) {
      //context.commit("setGameActive", b)
    },
    [BACKEND_PLAYER_ADDED](context, player) {
      context.commit(ADD_PLAYER, player)
    },
    [BACKEND_PLAYER_REMOVED](context, socketId) {
      context.commit(REMOVE_PLAYER, socketId)
    },
    [BACKEND_START_ROUND](context) {
      context.commit(START_ROUND)
    },
    [BACKEND_KEY_DOWN](context, res) {
      context.commit(KEY_DOWN, res)
    },
    [BACKEND_KEY_UP](context, res) {
      context.commit(KEY_UP, res)
    },
    [BACKEND_PLAYER_DEAD](context, socketId) {
      context.commit(PLAYER_DEAD, socketId)
    }
  },
}
)