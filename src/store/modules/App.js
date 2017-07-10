import Vue from 'vue'
import * as t from '@/store/mutation-types'
import { MIC_HOSTNAME } from '@/config'
import { Cognito } from '@/lib/Cognito'

const state = {
  manifest: null,
  user: null
}

const mutations = {
  [t.APP_SET_MANIFEST] (state, value) {
    state.manifest = value
  },
  [t.APP_SET_USER] (state, value) {
    state.user = value
  }
}

const actions = {
  init ({commit, dispatch}) {
    Vue.http.get(MIC_HOSTNAME)
      .then(response => {
        let manifest = response.body
        commit(t.APP_SET_MANIFEST, manifest)
        dispatch('initUser')
      })
      .catch(err => {
        console.warn(err)
      })
  },
  initUser ({commit, state}) {
    Cognito.init(state.manifest)
    Cognito.isAuthenticated()
      .then(() => {
        return Cognito.getParameters()
          .then(user => {
            commit(t.APP_SET_USER, user)
          })
      })
      .catch(err => {
        commit(t.APP_SET_USER, -1)
      })
  }
}

const getters = {
  inited: (state) => {
    return (state.manifest !== null)
  },
  userInited: (state) => {
    return (state.user !== null)
  },
  getUser: (state) => {
    return state.user
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
