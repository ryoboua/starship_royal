<template>
  <aside>
    <h3>
      Room Name:
      <span class="room_name">{{ roomName }}</span>
    </h3>
    <h4>Name: {{ name }}</h4>
    <h4>Player Number:{{ playerNumber }}</h4>
    <h4 :style="{ color }">
      Ship Color :
      <span
        :style="{
          background: color,
          height: '50px',
          width: '50px',
        }"
        >_</span
      >
    </h4>
    <div v-if="!gameActive">
      <button
        v-if="isHost"
        @click.once="startRound"
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
          <li
            v-for="p in players"
            :key="p.socketId"
            :style="{ color: p.color }"
          >
            {{ p.name }}
          </li>
        </ul>
      </div>
    </div>
    <ul>
      <li
        v-for="p in playerScores"
        :key="p.socketId"
        :style="{ color: p.color }"
      >
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
      color: (state) => state.client.color,
      gameActive: (state) => state.game.gameActive,
      players: (state) => state.game.players,
      type: (state) => state.game.type,
      timer: (state) => state.game.timer,
      playerScores: (state) => state.game.playerScores,
      disableStartBtn: (state) => state.game.disableStartBtn,
    }),
  },
  methods: mapActions("game", ["startRound", "returnToStartMenu"]),
};
</script>

<style lang="scss" scoped>
.room_name {
  color: $button-primary;
}
</style>