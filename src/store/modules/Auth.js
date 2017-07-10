import Vue from 'vue'
import * as t from '@/store/mutation-types'
import { MIC_HOSTNAME } from '@/config'
import { Cognito } from '@/lib/Cognito'

const state = {
}

const mutations = {
}

const actions = {
  login ({commit, dispatch}, {username, password}) {
    return new Promise((resolve, reject) => {
      Cognito.authenticate(username, password)
        .then(() => {
          dispatch('App/initUser', null, { root: true })
          resolve()
        })
        .catch(err => {
          reject(err.message)
        })
    })
  },
  logout ({commit}) {
    Cognito.logout()
    console.log('logout')
    commit('App/' + t.APP_SET_USER, -1, { root: true })
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
