import Vue from 'vue'
import * as t from '@/store/mutation-types'
import { MIC } from '@/lib/MIC'
import { MIC_THING_TYPE_ID } from '@/config'

const state = {
  things: [],
  selected: {
    id: null,
    timestamp: [],
    bat: [],
    hum: [],
    tmp: []
  }
}

const mutations = {
  [t.MIC_SET_THINGS] (state, value) {
    state.things = []
    value.forEach(thing => {
      try {
        let s = thing._source.state
        state.things.push({
          id: thing._id,
          bat: (typeof s.bat === 'undefined') ? null : parseFloat(s.bat),
          hum: (typeof s.hum === 'undefined') ? null : parseFloat(s.hum),
          tmp: (typeof s.tmp === 'undefined') ? null : parseFloat(s.tmp),
          pos: (typeof s.pos === 'undefined') ? 'None,None' : s.pos,
          timestamp: (typeof s.timestamp === 'undefined') ? null : s.timestamp
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
        thing.bat = (typeof reported.bat === 'undefined') ? thing.bat : parseFloat(reported.bat)
        thing.hum = (typeof reported.hum === 'undefined') ? thing.hum : parseFloat(reported.hum)
        thing.tmp = (typeof reported.tmp === 'undefined') ? thing.tmp : parseFloat(reported.tmp)
        thing.pos = (typeof reported.pos === 'undefined') ? thing.pos : reported.pos
        thing.timestamp = (typeof reported.timestamp === 'undefined') ? thing.timestamp : reported.timestamp
      })

      if (!found) {
        state.things.push({
          id: id,
          bat: (typeof reported.bat === 'undefined') ? null : parseFloat(reported.bat),
          hum: (typeof reported.hum === 'undefined') ? null : parseFloat(reported.hum),
          tmp: (typeof reported.tmp === 'undefined') ? null : parseFloat(reported.tmp),
          pos: (typeof reported.pos === 'undefined') ? 'None,None' : reported.pos,
          timestamp: (typeof reported.timestamp === 'undefined') ? null : reported.timestamp
        })
      }

    } catch (e) {
      return console.log(e)
      return
    }
  },
  [t.MIC_UPDATE_SELECTED] (state, reported) {
    // Add graph targets (cuz arrays are empty)
    if (state.selected.timestamp.length == 0) {
      state.selected.timestamp.unshift('x')
      state.selected.bat.unshift('Battery V')
      state.selected.hum.unshift('Humidity %')
      state.selected.tmp.unshift('Temperature °C')
    }

    state.selected.timestamp.push(reported.timestamp)
    state.selected.bat.push(parseFloat(reported.bat))
    state.selected.hum.push(parseFloat(reported.hum))
    state.selected.tmp.push(parseFloat(reported.tmp))
  },
  [t.MIC_SELECT_THING] (state, {thingName, data}) {
    data.hits.hits.forEach(hit => {
      state.selected.timestamp.push(hit._source.timestamp)
      state.selected.bat.push(parseFloat(hit._source.state.bat))
      state.selected.hum.push(parseFloat(hit._source.state.hum))
      state.selected.tmp.push(parseFloat(hit._source.state.tmp))
    })
    state.selected.timestamp.unshift('x')
    state.selected.bat.unshift('Battery V')
    state.selected.hum.unshift('Humidity %')
    state.selected.tmp.unshift('Temperature °C')
    state.selected.id = thingName
  },
  [t.MIC_DESELECT_THING] (state) {
    state.selected = {
      id: null,
      timestamp: [],
      bat: [],
      hum: [],
      tmp: []
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
  update ({commit, state}, {topic, message}) {
    try {
      let tmp = topic.split('/')
      let thing = tmp[tmp.length - 1]
      let payload = JSON.parse(message)
      commit(t.MIC_UPDATE_THING, {id: thing, reported: payload.state.reported})

      // Only update selected data (graph) if MQTT message was selected
      if (state.selected.id == thing)
        commit(t.MIC_UPDATE_SELECTED, payload.state.reported)
    } catch (e) {
      console.log(e)
      return
    }
  },
  select ({commit}, thingName) {
    commit(t.MIC_DESELECT_THING)
    let payload = {
      action: 'FIND',
      query: {
        _source: ['state.bat', 'state.tmp', 'state.hum', 'timestamp'],
        sort: { timestamp: { order: 'desc' } },
        filter: {
          bool: {
            must: [
              { terms: { thingName: [thingName] } },
              { range: { timestamp: {
                gte: (Date.now() - 5.751 * 24 * 60 * 60 * 1000),
                lte: Date.now()
              } } }
            ],
            minimum_should_match: 1,
            should: [
              { exists: { field: 'state.bat' } },
              { exists: { field: 'state.tmp' } },
              { exists: { field: 'state.hum' } }
            ]
          }
        },
        size: 1000
      }
    }
    return new Promise((resolve, reject) => {
      MIC.invoke('ObservationLambda', payload)
        .then(data => {
          commit(t.MIC_SELECT_THING, {thingName, data})
          resolve()
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
  },
  selected: (state) => {
    return state.selected
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
