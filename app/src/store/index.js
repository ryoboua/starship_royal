import Vue from "vue"
import Vuex from "vuex"
import client from "./client"
import game from "./game"
import modal from "./modal"
Vue.use(Vuex)

export default (socket) => new Vuex.Store({
  modules: { client, game: game(socket), modal },
})
