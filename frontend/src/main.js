import Vue from "vue"
import App from "./App.vue"
import store from "./store"
import VueSocketIO from "vue-socket.io"

Vue.config.productionTip = false

let url = "http://localhost:3000"

if (process.env.NODE_ENV === "production") {
  url = process.env.VUE_APP_BACKEND_URL
}

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: url,
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
