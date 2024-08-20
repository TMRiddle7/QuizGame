<template>
    <main>
      <top-ribbon-vue></top-ribbon-vue>
      <div class="container-fluid d-flex h-100">
        <!-- Online Players Panel -->
        <div class="col-md-2 border-end bg-light d-flex flex-column">
          <div class="p-3">
            <h4 class="mb-4">Online Players</h4>
            <online-player-vue></online-player-vue>
          </div>
        </div>
  
        <!-- Chat Box -->
        <div class="col-md-9 d-flex flex-column">
          <div class="chat-container flex-grow-1 d-flex flex-column">
            <div class="chat-area flex-grow-1 overflow-auto p-3 border">
              <chat-panel></chat-panel>
            </div>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  import onlinePlayerVue from "@/components/onlinePlayer.vue";
  import TopRibbonVue from "@/components/TopRibbon.vue";
  import ChatPanel from "@/components/ChatPanel.vue";
  import { defineComponent } from "vue";
  
  export default defineComponent({
    components: {
      onlinePlayerVue,
      TopRibbonVue,
      ChatPanel,
    }
  });
  </script>
  
  <style scoped>
  /* Ensure the main content fills the viewport height */
  .container-fluid {
    height: calc(100vh - 56px); /* Adjust based on top ribbon height */
  }
  
  .chat-area {
    display: flex;
    flex-direction: column;
  }
  
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .online-players {
    border-right: 1px solid #ddd;
    background-color: #f8f9fa;
  }
  </style>
  