import { createStore } from 'vuex';

export default createStore({
  state: {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    player: null,
    accessToken: localStorage.getItem('accessToken'),
    playerUsername: null,
  },
  mutations: {
    setLoginState(state, payload) {
      state.isLoggedIn = payload.isLoggedIn;
      state.player = payload.player;
      state.accessToken = payload.accessToken;

      localStorage.setItem('isLoggedIn', String(state.isLoggedIn));
    },
  },
  actions: {
    login({ commit }, player) {
      commit('setLoginState', { isLoggedIn: true, player });      
    },
    logout({ commit }) {
      commit('setLoginState', { isLoggedIn: false, player: null });
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    player: (state) => state.player,
    accessToken: (state) => state.accessToken,
  },
});