import Vue from 'vue'
import * as t from '@/store/mutation-types'
import { MIC_HOSTNAME } from '@/config'
import { MIC } from '@/lib/MIC'
import { MIC_THING_TYPE_ID } from '@/config'

const state = {
  things: []
}

const mutations = {
  [t.MIC_SET_THINGS] (state, value) {
    state.things = []

    value.forEach(thing => {
      try {
        state.things.push({
          id: thing._id,
          createdAt: thing._source.createdAt,
          pos: (typeof thing._source.state.pos === 'undefined') ? 'None,None' : thing._source.state.pos
        })
      } catch (e) {
        return
      }
    })
  }
}

const actions = {
  getThings ({commit}) {
    let payload = {
      action: 'FIND',
      query: {
        size: 1000,
        query: {
          term: {
            thingType: MIC_THING_TYPE_ID
          },
        }
      }
    }

    return new Promise((resolve, reject) => {
      MIC.invoke('ThingLambda', payload)
        .then(data => {
          try {
            let hits = data.hits.hits
            commit(t.MIC_SET_THINGS, hits)
            resolve()
          } catch (e) {
            reject(e)
          }
        })
        .catch(err => { reject(err) })
    })
  }
}

const getters = {
  things: (state) => {
    return state.things
  },
  regThings: (state) => {
    let tmp = []
    state.things.forEach(thing => {
      if (thing.pos !== 'None,None')
        tmp.push(thing)
    })
    return tmp
  },
  unregThings: (state) => {
    let tmp = []
    state.things.forEach(thing => {
      if (thing.pos == 'None,None')
        tmp.push(thing)
    })
    return tmp
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
