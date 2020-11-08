import Vue from "vue"
import Vuex from "vuex"
import client from "./clientStore"
import game from "./gameStore"
import modal from "./modalStore"
import { SocketType as Socket } from "../../types"

Vue.use(Vuex)

export default (socket: Socket) => new Vuex.Store({
  modules: { client: client(socket), game: game(socket), modal },
})
