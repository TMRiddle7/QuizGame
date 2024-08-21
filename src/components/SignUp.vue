<template>
  <div class="card mx-auto mt-5" style="max-width: 500px;">
    <div class="card-body">
      <h2 class="card-title text-center mb-4" :style="{ fontFamily: 'Roboto, sans-serif' }">Sign Up</h2>
      <form @submit.prevent="handleSignUp" class="p-4">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="signupUsername"
            placeholder="Username"
            v-model="username"
            required
          />
          <label for="signupUsername">Username</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="email"
            class="form-control"
            id="signupEmail"
            placeholder="name@example.com"
            v-model="email"
            required
          />
          <label for="signupEmail">Email address</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="password"
            class="form-control"
            id="signupPassword"
            placeholder="Password"
            v-model="password"
            required
            autocomplete
          />
          <label for="signupPassword">Password</label>
        </div>
        <button type="submit" class="btn btn-dark w-100">Sign Up</button>
        <p v-if="error" class="text-danger mt-3">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { signUp } from '../services/authService';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async handleSignUp() {
      try {
        const result = await signUp(this.username, this.email, this.password);
        if (result.status === 'success') {
          this.$emit('signup-success');
        } else {
          this.error = result.message;
        }
      } catch (err) {
        this.error = `Unexpected Error: ${err.message}`;
      }
    },
  },
};
</script>
