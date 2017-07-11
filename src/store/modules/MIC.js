import Vue from 'vue'
import * as t from '@/store/mutation-types'
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
          bat: (typeof thing._source.state.bat === 'undefined') ? null : thing._source.state.bat,
          hum: (typeof thing._source.state.hum === 'undefined') ? null : thing._source.state.hum,
          tmp: (typeof thing._source.state.tmp === 'undefined') ? null : thing._source.state.tmp,
          pos: (typeof thing._source.state.pos === 'undefined') ? 'None,None' : thing._source.state.pos,
          timestamp: (typeof thing._source.state.timestamp === 'undefined') ? null : thing._source.state.timestamp
        })
      } catch (e) {
        return
      }
    })
  },
  [t.MIC_UPDATE_THING] (state, {id, reported}) {
    let found = false

    try {
      state.things.forEach(thing => {
        if (thing.id !== id) return

        found = true
        thing.bat = (typeof reported.bat === 'undefined') ? thing.bat : reported.bat
        thing.hum = (typeof reported.hum === 'undefined') ? thing.hum : reported.hum
        thing.tmp = (typeof reported.tmp === 'undefined') ? thing.tmp : reported.tmp
        thing.pos = (typeof reported.pos === 'undefined') ? thing.pos : reported.pos
        thing.timestamp = (typeof reported.timestamp === 'undefined') ? thing.timestamp : reported.timestamp
      })

      if (!found) {
        console.log('NOT')
        state.things.push({
          id: id,
          createdAt: null,
          bat: (typeof reported.bat === 'undefined') ? null : reported.bat,
          hum: (typeof reported.hum === 'undefined') ? null : reported.hum,
          tmp: (typeof reported.tmp === 'undefined') ? null : reported.tmp,
          pos: (typeof reported.pos === 'undefined') ? 'None,None' : reported.pos,
          timestamp: (typeof reported.timestamp === 'undefined') ? null : reported.timestamp
        })
      }

    } catch (e) {
      return console.log(e)
      return
    }
  }
}

const actions = {
  init ({commit, dispatch}) {
    let payload = {
      action: 'FIND',
      query: {
        size: 10,
        from: 0,
        sort: {
          'label.lowercase': 'asc'
        },
        filter: {
          bool: {
            must: [{
              term: {
                thingType: MIC_THING_TYPE_ID
              }
            }]
          }
        }
      }
    }
    return new Promise((resolve, reject) => {
      MIC.invoke('ThingLambda', payload)
        .then(data => {
          let hits = null
          try {
            hits = data.hits.hits
          } catch (e) {
            reject(e.message)
          }
          commit(t.MIC_SET_THINGS, hits)

          resolve()
        })
        .catch(err => { reject(err) })
    })
  },
  update ({commit}, {topic, message}) {
    try {
      let tmp = topic.split('/')
      let thing = tmp[tmp.length - 1]
      let payload = JSON.parse(message)
      commit(t.MIC_UPDATE_THING, {id: thing, reported: payload.state.reported})
    } catch (e) {
      console.log(e)
      return
    }
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
