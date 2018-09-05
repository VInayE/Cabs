import Vue from 'vue'
import Vuex from 'vuex'
import rental from './modules/rental/rentalModule'
import p2p from './modules/p2p/p2pModule'
import selfDrive from './modules/selfDrive/sDModule'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  plugins: [createPersistedState({storage: window.sessionStorage})],
  modules: {
    p2p,
    rental,
    selfDrive
  }
})
