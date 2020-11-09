<template>
  <aside>
    <h3>
      Room Name:
      <span class="room_name">{{ roomName }}</span>
    </h3>
    <h4>Name: {{ name }}</h4>
    <h4>Player Number:{{ playerNumber }}</h4>
    <h4>Current Level: {{ level.number }}</h4>
    <div v-if="!gameActive">
      <button
        v-if="isHost"
        @click.once="handleStartGame"
        :disabled="disableStartBtn"
      >
        Start Round
      </button>
      <div v-if="type === 'multi'">
        <h4>Current players in lobby:</h4>
        <ul>
          <li v-for="(p, i) in players" :key="i">
            {{ p.name }}
          </li>
        </ul>
      </div>
    </div>
    <ul v-if="gameActive">
      <h2>Timer: {{ timer }}</h2>
      <li v-for="(p, i) in playerScores" :key="i">
        {{ p.name }} : {{ p.score }}
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { RootState } from "../../interfaces";

export default Vue.extend({
  name: "SidePanel",
  computed: {
    ...mapState({
      name: (state: RootState) => state.client.name,
      playerNumber: (state: RootState) => state.client.playerNumber,
      roomName: (state: RootState) => state.client.roomName,
      isHost: (state: RootState) => state.client.host,
      gameActive: (state: RootState) => state.game.gameActive,
      players: (state: RootState) => state.game.players,
      type: (state: RootState) => state.game.type,
      level: (state: RootState) => state.game.level,
      timer: (state: RootState) => state.game.timer,
      playerScores: (state: RootState) => state.game.playerScores,
      disableStartBtn: (state: RootState) => state.game.disableStartBtn,
    }),
  },
  methods: {
    ...mapActions("game", ["startRound", "displayMsg"]),
    handleStartGame() {
      this.clearGameScreenInformation();
      this.startRound();
    },
    clearGameScreenInformation() {
      this.displayMsg("");
    },
  },
});
</script>

<style lang="scss" scoped>
.room_name {
  color: $button-primary;
}
</style>