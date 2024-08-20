<template>
  <div>
    <button class="btn btn-danger" @click="signOut">Sign Out</button>
    <p>{{ userName }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { signOut as signOutService } from '../services/authService';

export default {
  data() {
    return {
      userName: localStorage.getItem('playerUsername') || '',
    };
  },
  methods: {

    async signOut() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          await signOutService(accessToken);
        }
        this.$emit('signout'); // Emitting event to parent component
      } catch (error) {
        console.error(error.message);
      }
    },
  },
};
</script>
