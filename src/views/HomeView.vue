<template>
  <div>
  <div class="container">
    <!-- Tabbed SignIn/SignUp -->
    <ul class="nav nav-tabs mb-4" id="authTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="signin-tab"
          data-bs-toggle="tab"
          data-bs-target="#signin"
          type="button"
          role="tab"
          aria-controls="signin"
          aria-selected="true"
        >
          Sign In
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="signup-tab"
          data-bs-toggle="tab"
          data-bs-target="#signup"
          type="button"
          role="tab"
          aria-controls="signup"
          aria-selected="false"
        >
          Sign Up
        </button>
      </li>
    </ul>

    <div class="tab-content" id="authTabsContent">
      <div
        class="tab-pane fade show active"
        id="signin"
        role="tabpanel"
        aria-labelledby="signin-tab"
      >
        <SignIn v-if="!isLoggedIn" @signin="handleSignIn" />
      </div>
      <div
        class="tab-pane fade"
        id="signup"
        role="tabpanel"
        aria-labelledby="signup-tab"
      >
        <SignUp v-if="!isLoggedIn" @signup-success="handleSignUpSuccess" />
      </div>
    </div>
  </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import SignIn from '../components/SignIn.vue';
import { onMounted } from 'vue';
import SignUp from '../components/SignUp.vue';
import { useRouter } from 'vue-router';
// const router = useRoute();

export default {
  components: {
    SignIn,
    SignUp,
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['login', 'logout']),
    handleSignIn(player) {
      this.login(player);
      console.log(this.isLoggedIn);
      this.$router.push('/home');
    },
    handleSignUpSuccess() {
      alert('Sign up successful! Please sign in.');
    },
    handleSignOut() {
      this.logout();
    },
    
  },
  setup() {
    const router = useRouter();
    onMounted(() => {
      const username = localStorage.getItem('playerUsername');
      if (username) {
        router.push('/home');
      }
    });
  }
};

</script>
