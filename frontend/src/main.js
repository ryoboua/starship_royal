import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false;

 
Vue.use(new VueSocketIO({
    debug: false,
    connection: 'http://localhost:3000',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    //options: { path: "/my-app/" } //Optional options
}))

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
