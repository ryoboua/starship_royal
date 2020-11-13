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
      <br />
      <br />
      <button @click.once="returnToStartMenu">Leave Room</button>
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

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "SidePanel",
  computed: {
    ...mapState({
      name: (state) => state.client.name,
      playerNumber: (state) => state.client.playerNumber,
      roomName: (state) => state.client.roomName,
      isHost: (state) => state.client.host,
      gameActive: (state) => state.game.gameActive,
      players: (state) => state.game.players,
      type: (state) => state.game.type,
      level: (state) => state.game.level,
      timer: (state) => state.game.timer,
      playerScores: (state) => state.game.playerScores,
      disableStartBtn: (state) => state.game.disableStartBtn,
    }),
  },
  methods: {
    ...mapActions("game", ["startRound", "displayMsg", "returnToStartMenu"]),
    handleStartGame() {
      this.clearGameScreenInformation();
      this.startRound();
    },
    clearGameScreenInformation() {
      this.displayMsg("");
    },
  },
};
</script>

<style lang="scss" scoped>
.room_name {
  color: $button-primary;
}
</style>