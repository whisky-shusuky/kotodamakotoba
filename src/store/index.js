import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  message: ''
}

const mutations = {
  setMessage (state, val) {
    state.message = val
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store
