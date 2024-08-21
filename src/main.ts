import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
//import {subClient} from './services/chatService'; // Corrected import
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';



// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import { provideApolloClient } from '@vue/apollo-composable';

//provideApolloClient(subClient);

createApp(App).use(router).use(store).mount('#app');