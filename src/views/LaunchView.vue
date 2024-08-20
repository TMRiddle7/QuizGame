<template>
    <main class="bg-gradient ">
        <!-- Top Ribbon -->
        <TopRibbonVue />

        <!-- Main Content -->
        <div class="container text-center">
            <!-- Large Logo -->
            <img src="../assets/logo.png" alt="Large Logo" class="img-fluid mb-3"
                style="width: 265px; height: 256px;" />

            <!-- Buttons -->
            <div class="d-flex justify-content-center gap-3">
                <div class="d-flex flex-column justify-content-center gap-3">
                    <router-link to="/game" class="btn btn-outline-dark">Play</router-link>
                    <!-- <router-link to="/chat" class="btn btn-outline-dark">Chat</router-link> -->
                    <router-link to="/leaderboard" class="btn btn-outline-dark">LeaderBoard</router-link>
                    <img src="https://pgpccawsgauravwadile.s3.amazonaws.com/CountryFlags/Flag_of_Afghanistan-512x341.png">
                </div>
            </div>
        </div>
    </main>
</template>
  
  <script>
  import TopRibbonVue from "@/components/TopRibbon.vue";
  
  export default {
    components: {
      TopRibbonVue,
    },
  };
  </script>
  
  <style scoped>
  .bg-gradient {
    background: radial-gradient(circle, #8e2a2a, #a92929);
  }
  </style>
  