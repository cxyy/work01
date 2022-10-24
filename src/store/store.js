import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    auth: '',
    username: ''
  },
  mutations: {
    m_saveAuth (state, data) {
      state.auth = data
    },
    m_saveName (state, data) {
      state.username = data
    }
  },
  actions: {
    saveAuth ({commit}, data) {
      commit('m_saveAuth', data)
    },
    saveName ({commit}, data) {
      commit('m_saveName', data)
    }
  }
})

export default store
