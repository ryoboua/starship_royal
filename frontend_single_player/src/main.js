import Vue from "vue"
import App from "./App.vue"
import store from "./store"
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.config.productionTip = false

let url = "http://localhost:3000"

if (process.env.NODE_ENV === "production") {
  url = "http://159.203.17.103"
}

const socket = SocketIO(url, {
  autoConnect: true
});

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: socket,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
)

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app")
