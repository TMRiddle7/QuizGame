<template>
    <div>
         <!-- Top Ribbon -->
     <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 ">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img src="../assets/logo.png" alt="Logo" width="72" height="72" class="me-2" />
          AskMe
        </a>
        <div class="d-flex">
          <SignOut v-if="isLoggedIn" @signout="handleSignOut" />
        </div>
        </div>
    </nav>

        <div>
         <home-view></home-view>
        </div>

    </div>
    
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SignOut from '../components/SignOut.vue';
import HomeView from './HomeView.vue';



export default {
  components: {
    SignOut,
    HomeView,
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['login', 'logout']),
    handleSignOut() {
      this.logout();
      sessionStorage.removeItem('player');
      sessionStorage.removeItem('accessToken');
    },
  },
}
</script>