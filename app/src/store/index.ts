import Vue from "vue"
import Vuex from "vuex"
import client from "./clientStore"
import game from "./gameStore"
import modal from "./modalStore"
import socketIO from "socket.io"

Vue.use(Vuex)

export default (socket: socketIO.Socket) => new Vuex.Store({
  modules: { client: client(socket), game: game(socket), modal },
})
