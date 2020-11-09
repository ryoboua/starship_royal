import mutations from "./gameMutations"
import actions from "./gameActions"

import { SocketType as Socket } from "./../../../types"
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
export default (socket: Socket) => ({
  namespaced: true,
  state,
  mutations,
  actions: actions(socket)
}
)