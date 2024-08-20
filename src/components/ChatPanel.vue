<template>
    <main>
      <div class="container-fluid d-flex flex-column" id="chatbox">
        <!-- Messages Container -->
        <div class="messages-container border mt-2 pt-2 pb-3 flex-grow-1">
          <div
            v-for="message in allMessages"
            :key="message.MessageID"
            :class="['d-flex', message.Sender === currentPlayer ? 'justify-content-end' : 'justify-content-start']"
          >
            <div class="message-bubble p-2 mb-2 rounded" :class="message.Sender === currentPlayer ? 'bd-blue-100 text-dark' : 'bd-purple-100 text-dark'">
              <p class="mb-1">{{ message.Content }}</p>
              <small class="text-muted">{{ message.Timestamp }}</small>
            </div>
          </div>
        </div>
  
        <!-- Input Field -->
        <div class="input-group mt-3">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Type a message..." 
            v-model="newMessage" 
            @keyup.enter="sendMessage"
          />
          <button class="btn btn-dark" @click="sendMessage">Send</button>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  import { fetchMessages, SendMessage, client as apolloClient } from '@/services/chatService';
  import { defineComponent, computed } from 'vue';
  import { ref, onMounted, nextTick } from 'vue';
  import { useSubscription } from '@vue/apollo-composable';
  import {ON_MESSAGE_RECEIVED} from '../graphql/subs';
  
  const senderID = 'player5';
  const receiverID = 'player1';
  
  export default defineComponent({
    setup() {
        const subMessages = ref([]);
      const messages = ref([]);
      const newMessage = ref('');
      const currentPlayer = 'player5';
      const error = ref(null);
      const tempMessages = ref([]); // Temporary state for newly sent messages
      const variable = {
        receiverID: 'player1',
      }

       subMessages.value = apolloClient.subscribe(
        {
            query: ON_MESSAGE_RECEIVED,variables: variable
        }
      )

      const fetchAllMessages = async () => {
        try {
          const data = await fetchMessages(receiverID, senderID);
          messages.value = data;
          const messageArray = [...data];
          messages.value = messageArray.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
          console.log(messages.value);
        } catch (err) {
          console.error('Error fetching messages:', err);
          error.value = 'Failed to fetch messages.';
        }
      };
  
      const sendMessage = async () => {
        try {
          if (newMessage.value.trim() !== '') {
            const messageContent = newMessage.value.trim();
            const timestamp = new Date().toISOString();
            const newMsg = {
              MessageID: Date.now(), // Temporary ID, replace with actual ID from response if needed
              Content: messageContent,
              Sender: senderID,
              Timestamp: timestamp,
            };
  
            tempMessages.value.push(newMsg); // Add the new message to the temporary state
            newMessage.value = ''; // Clear the input field after sending
  
            // Scroll to bottom after adding the new message
            nextTick(() => {
              const container = document.querySelector('.messages-container');
              container.scrollTop = container.scrollHeight;
            });
  
            const response = await SendMessage(messageContent, senderID, receiverID);
            console.log(response);
  
            // Introduce a slight delay before fetching all messages again
            setTimeout(async () => {
              await fetchAllMessages(); // Fetch updated messages
              tempMessages.value = []; // Clear temporary messages after fetching
            }, 1000); // Adjust the delay as needed (1000ms = 1 second)
          }
        } catch (err) {
          console.error('Error sending message:', err);
        }
      };
  
      onMounted(() => {
       fetchAllMessages();
      
      console.log(subMessages);
      });
  
      return {
        subMessages,
        messages,
        newMessage,
        sendMessage,
        currentPlayer,
        error,
        tempMessages,
        allMessages: computed(() => [...messages.value, ...tempMessages.value]), // Combine fetched and temporary messages
      };
    },
  });
  </script>
  
  <style scoped>
  main {
    display: flex;
    flex-direction: column;
    height: 70vh;
  }
  
  #chatbox {
    display: flex;
    flex-direction: column;
    height: 70vh;
  }
  
  .messages-container {
    max-height: calc(100vh - 150px); /* Adjust based on header and input height */
    overflow-y: auto;
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: transparent transparent; /* Firefox */
  }
  
  .messages-container::-webkit-scrollbar {
    width: 8px; /* Width of the scrollbar */
  }
  
  .messages-container::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* Color of the scrollbar thumb */
    border-radius: 4px;
  }
  
  .messages-container::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.6); /* Color of the scrollbar thumb on hover */
  }
  
  .messages-container::-webkit-scrollbar-track {
    background: transparent; /* Color of the scrollbar track */
  }
  
  .message-bubble {
    max-width: 60%;
    word-wrap: break-word;
  }
  
  .bd-blue-100 {
    background-color: rgb(214, 228, 255);
  }
  
  .bd-purple-100 {
    background-color: rgb(236, 217, 253);
  }
  </style>