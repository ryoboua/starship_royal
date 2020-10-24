import mutations from "./gameMutations"
import backendActions from "./backendActions"
import clientActions from "./clientActions"

export default (socket) => ({
  namespaced: true,
  state: {
    _gameInstance: null,
    gameActive: false,
    gameState: null,
    type: 'single',
    level: {},
    timer: null,
    players: [],
    playerScores: [],
    screen: '',
    disableStartBtn: false,
  },
  mutations,
  actions: {
    ...clientActions(socket),
    ...backendActions
  },
}
)