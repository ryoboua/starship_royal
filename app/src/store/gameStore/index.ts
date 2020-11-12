import { FrontendSocket } from "./../../../shared/types"
import getDefaultState from "./gameState";
import mutations from "./gameMutations"
import actions from "./gameActions"

export default (socket: FrontendSocket) => ({
  namespaced: true,
  state: getDefaultState(),
  mutations,
  actions: actions(socket)
})