import Vue from "vue"
import App from "./App.vue"
import initStore from "./store"
import VueSocketIO from 'vue-socket.io'
import SocketIOClient from 'socket.io-client'
import { FrontendSocket } from '../shared/types'

Vue.config.productionTip = false

let url = "http://localhost:3005"

if (process.env.NODE_ENV === "production") {
  url = "https://starshiproyal.whoisreggie.ca"
}

const socket: FrontendSocket = SocketIOClient(url, {
  autoConnect: false
});

const store = initStore(socket)

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: socket,
    vuex: {
      store,
      actionPrefix: "BACKEND_",
    },
  })
)

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app")