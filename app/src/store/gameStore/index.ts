import { FrontendSocket } from "./../../../shared/types"
import getDefaultState from "./gameState";
import mutations from "./gameMutations"
import frontendActions from "./frontendActions"
import backendActions from "./backendActions"

export default (socket: FrontendSocket) => ({
  namespaced: true,
  state: getDefaultState(),
  mutations,
  actions: {
    ...frontendActions(socket),
    ...backendActions(socket)
  }
})