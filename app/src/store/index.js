import Vue from "vue"
import Vuex from "vuex"
import client from "./clientStore"
import game from "./gameStore/"
import modal from "./modalStore"
Vue.use(Vuex)

export default (socket) => new Vuex.Store({
  modules: { client, game: game(socket), modal },
})
