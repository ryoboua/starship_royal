import mutations from "./gameMutations"
import actions from "./gameActions"

import { FrontendSocket } from "./../../../types"
import { GameStore } from "./../../../interfaces"

const state: GameStore = {
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

}
export default (socket: FrontendSocket) => ({
  namespaced: true,
  state,
  mutations,
  actions: actions(socket)
}
)