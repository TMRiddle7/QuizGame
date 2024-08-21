<template>
    <div class="card mx-auto" style="max-width: 500px;">
      <div class="card-body">
        <h2 class="card-title text-center mb-4" :style="{ fontFamily: 'Roboto, sans-serif' }">Sign In</h2>
        <form @submit.prevent="signIn">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="signinUsername"
              v-model="username"
              placeholder="Username"
              required
            />
            <label for="signinUsername">Username</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="signinPassword"
              v-model="password"
              placeholder="Password"
              required
              autocomplete
            />
            <label for="signinPassword">Password</label>
          </div>
          <button type="submit" class="btn btn-dark w-100">Sign In</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { signIn as signInService } from '../services/authService';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      async signIn() {
    const response = await signInService(this.username, this.password);
    if (response.success) {
      this.$emit('signin', { username: this.username, token: response.AccessToken });
    } else {
      // Emit an error event to display the error message in the parent component
      this.$emit('signin-error', response.error);
    }
  },
    },
  };
  </script>
  