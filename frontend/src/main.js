import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import VueSocketIO from "vue-socket.io";

Vue.config.productionTip = false;

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://159.203.17.103";

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: url,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
