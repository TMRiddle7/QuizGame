<template>
    <div class="footer">
      <button @click="goHome" class="btn btn-primary footer-btn home-btn"><i class="bi-alarm"></i>Home</button>
      <button @click="goBack" class="btn btn-secondary footer-btn back-btn">Back</button>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const router = useRouter();
  
      function goHome() {
        router.push('/home'); // Adjust the route name as needed
      }
  
      function goBack() {
        router.back();
      }
  
      return { goHome, goBack };
    }
  }
  </script>
  
  <style scoped>
  .footer {
    position: fixed;
    bottom: 30px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 10px;
     /* Background color with transparency */
    z-index: 1000;
  }
  
  .footer-btn {
    opacity: 0.1;
    transition: opacity 0.3s ease;
  }
  
  .footer-btn:hover,
  .footer-btn:focus {
    opacity: 1;
  }
  
  .home-btn {
    position: absolute;
    right: 10px;
  }
  
  .back-btn {
    position: absolute;
    left: 10px;
  }
  </style>
  