import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import MenuView from '@/views/MenuView.vue';
import GameView from '../views/GameView.vue';
import ChatView from '../views/ChatView.vue';
import SignUp from '../components/SignUp.vue';
import LaunchView from '@/views/LaunchView.vue';
import QuizView from '@/views/QuizView.vue';
import LeaderboardView from '@/views/LeaderboardView.vue';
const routes = [
  { path: '/', component: MenuView },
  { path: '/home', component: LaunchView },
  { path: '/game', component: GameView },
  { path: '/chat', component: ChatView },
  { path: '/signup', component: SignUp },
  { path: '/leaderboard', component: LeaderboardView},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;