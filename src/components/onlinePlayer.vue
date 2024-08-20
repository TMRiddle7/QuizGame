<template>
  <div class="online-players">
    <div v-for="player in players" :key="player.Username" class="player-button">
      <button class="btn btn-outline-dark w-100 mb-2">
        {{ player.Username }}
      </button>
    </div>
    <p v-if="error" class="text-danger">{{ error }}</p>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { fetchOnlinePlayers } from '../services/chatService';


  export default defineComponent({
  setup() {
    const players = ref([]);
    const error = ref(null);

    onMounted(async () => {
      try {
        const data = await fetchOnlinePlayers();
        const currentPlayer = localStorage.getItem('playerUsername');
        players.value = data.getOnlinePlayers.filter(player => player.Username !== currentPlayer );
      } catch (err) {
        console.error('Error fetching online players:', err);
        error.value = 'Failed to fetch online players.';
      }
    });

    return {
      players,
      error,
    };
  },
});
</script>