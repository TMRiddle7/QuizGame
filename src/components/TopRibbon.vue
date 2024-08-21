<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img src="../assets/logo.png" alt="Logo" width="72" height="72" class="me-2" />
          AskMe
        </a>
        <div class="d-flex">
          <SignOut v-if="isLoggedIn === 'true'"  @signout="handleSignOut" />
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { mapGetters, mapActions, useStore } from 'vuex';
  import SignOut from '../components/SignOut.vue';
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
  components: {
    SignOut,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    onMounted(() => {
      if (isLoggedIn === 'false') {
        router.push('/');
      }
    });


    const handleSignOut = async () => {
      await store.dispatch('logout');
      localStorage.removeItem('playerUsername');
      localStorage.removeItem('accessToken');
      store.dispatch('logout');
      router.push('/');
    };

    return {
      isLoggedIn,
      handleSignOut,
    };
  },
};
</script>
  
  <style scoped>
  /* Ensure the navbar spans full width */
  .navbar {
    width: 100%;
    position: relative;
    z-index: 1000; /* Ensures the navbar stays on top of other elements */
  }
  </style>
  