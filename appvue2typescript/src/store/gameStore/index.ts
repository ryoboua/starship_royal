import mutations from "./gameMutations"
import actions from "./gameActions"

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
  actions: actions(socket)
}
)