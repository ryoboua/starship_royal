import Vue from "vue"
import Vuex from "vuex"
import client from "./clientStore"
import game from "./gameStore"
import modal from "./modalStore"
import { FrontendSocket } from "../../shared/types"

Vue.use(Vuex)

export default (socket: FrontendSocket) => new Vuex.Store({
  modules: {
    client: client(socket),
    game: game(socket),
    modal
  },
})
