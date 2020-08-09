import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  message: '',
  unicodePoints: [],
  rWeight: 0,
  gWeight: 0,
  bWeight: 0,
  twitterUrl: 'https://twitter.com/intent/tweet?text=KotodamaKotoba%E3%81%A7%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%81%AB%E8%89%B2%E3%82%92%E8%BE%BC%E3%82%81%E3%81%BE%E3%81%97%E3%81%9F%EF%BC%81&url=https%3A%2F%2Fwhisky-shusuky.github.io%2Fkotodamakotoba%2F%23%2F&hashtags=kotodamakotoba',
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
  setTwitterUrl (state, val) {
    state.twitterUrl = val
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
