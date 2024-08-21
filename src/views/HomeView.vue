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
          <SignIn v-if="!isLoggedIn" @signin="handleSignIn" @signin-error="handleSignInError" />
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

      <!-- Display error message here -->
      <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SignIn from '../components/SignIn.vue';
import SignUp from '../components/SignUp.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { checkCredentialsExpiry } from '@/services/authService';

export default {
  components: {
    SignIn,
    SignUp,
  },
  data() {
    return {
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['login', 'logout']),
    handleSignIn(player) {
      this.login(player);
      this.$router.push('/home');
    },
    handleSignInError(errorMessage) {
      this.errorMessage = errorMessage;
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
      console.log(checkCredentialsExpiry());
      if(checkCredentialsExpiry()){
        alert("Credentials are expired.Please Login again")
        router.push('/');
      }
      else{
      const username = localStorage.getItem('playerUsername');
      if (username) {
        router.push('/home');
      }
    }
    });
  }
};
</script>
