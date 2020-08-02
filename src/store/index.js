import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  message: '',
  unicodePoints: [],
  rWeight: 0,
  gWeight: 0,
  bWeight: 0,
  rotateBoxResetKey: 0
}

// TODO: 対象state名を文字列で渡して汎用的に更新できるほうにした方がいい？（よく分かっていない）
const mutations = {
  setMessage (state, val) {
    state.message = val
  },
  setUnicodePoints (state, val) {
    state.unicodePoints = val
  },
  setRWeight (state, val) {
    state.rWeight = val
  },
  setGWeight (state, val) {
    state.gWeight = val
  },
  setBWeight (state, val) {
    state.bWeight = val
  },
  incrementRotateBoxResetKey (state) {
    state.rotateBoxResetKey += 1
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store
