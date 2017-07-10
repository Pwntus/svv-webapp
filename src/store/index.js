import Vue from 'vue'
import Vuex from 'vuex'
import App from '@/store/modules/App'
import MIC from '@/store/modules/MIC'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    App,
    MIC
  },
  strict: process.env.NODE_ENV !== 'production'
})
