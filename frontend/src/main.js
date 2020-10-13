import Vue from "vue"
import App from "./App.vue"
import store from "./store"
import VueSocketIO from "vue-socket.io"

Vue.config.productionTip = false

const prodServer = "http://159.203.17.103"
//const devServer = "http://localhost:3000"

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: prodServer,
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
