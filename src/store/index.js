import Vue from 'vue'
import Vuex from 'vuex'

import App from '@/store/modules/App'
import Auth from '@/store/modules/Auth'
import MIC from '@/store/modules/MIC'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    App,
    Auth,
    MIC
  },
  strict: process.env.NODE_ENV !== 'production'
})
