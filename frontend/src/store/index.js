import Vue from "vue";
import Vuex from "vuex";
import client from "./client";
import game from "./game";
import modal from "./modal";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: { client, game, modal }
});
