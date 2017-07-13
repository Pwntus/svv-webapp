import Vue from 'vue'
import * as t from '@/store/mutation-types'
import { MIC } from '@/lib/MIC'
import { MIC_THING_TYPE_ID } from '@/config'

const state = {
  things: [],
  observed: null
  /*{
    id: null,
    timestamp: [],
    bat: [],
    hum: [],
    tmp: []
  }*/
}

const mutations = {

  [t.MIC_SET_THINGS] (state, hits) {
    state.things = hits.map(hit => {
      let s = hit._source.state
      return {
        id: hit._id,
        bat: parseFloat(s.bat),
        hum: parseFloat(s.hum),
        tmp: parseFloat(s.tmp),
        pos: s.pos,
        timestamp: s.timestamp
      }
    }).reduce((a, b) => {
      a.push(b)
      return a
    }, [])
  },

  [t.MIC_SET_OBSERVATION] (state, {thingName, hits}) {
    state.observed = { id: thingName, bat: [], hum: [], tmp: [], timestamp: [] }
    hits.map(hit => {
      let s = hit._source
      return {
        bat: parseFloat(s.state.bat),
        hum: parseFloat(s.state.hum),
        tmp: parseFloat(s.state.tmp),
        timestamp: s.timestamp
      }
    }).reduce((a, b) => {
      a.bat.push(b.bat)
      a.hum.push(b.hum)
      a.tmp.push(b.tmp)
      a.timestamp.push(b.timestamp)
      return a
    }, state.observed)
  },

  [t.MIC_UPDATE_THINGS] (state, {thingName, reported}) {
    let newThing = (typeof state.things.find(thing => thing.id === thingName) === 'undefined')

    reported = {
      bat: parseFloat(reported.bat),
      bat: parseFloat(reported.bat),
      bat: parseFloat(reported.bat)
    }

    if (newThing) {

    }


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
  }
}

const actions = {

  /* Init is called when the app is loaded and
   * finds all devices belonging to the thing type.
   * TODO: find latest `pos` value of a thing that is NOT 'None,None'
   */
  init ({commit, dispatch}) {
    let payload = {
      action: 'FIND',
      query: {
        size: 10,
        from: 0,
        sort: { 'label.lowercase': 'asc' },
        filter: {
          bool: {
            must: [{
              term: { thingType: MIC_THING_TYPE_ID }
            }]
    } } } }

    return MIC.invoke('ThingLambda', payload)
      .then(data => { return data.hits.hits })
      .then(hits => {
        commit(t.MIC_SET_THINGS, hits)
        return Promise.resolve()
      })
      .catch(err => { return Promise.reject(err) })
  },

  /* Observe will execute an ES DSL query for a specific thing.
   * The results are stored in a special `observed` state
   * with the latest results. MQTT will append this state to
   * dynamically update any graphs.
   */
  observe ({commit}, thingName) {
    let payload = {
      action: 'FIND',
      query: {
        size: 1000,
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
          } } } }

    return MIC.invoke('ObservationLambda', payload)
      .then(data => { return data.hits.hits })
      .then(hits => {
        commit(t.MIC_SET_OBSERVATION, {thingName, hits})
        return Promise.resolve()
      })
      .catch(err => { return Promise.reject(err) })
  },

  update ({commit, state}, {topic, message}) {
    try {
      let thingName = topic.split('/').pop()
      let reported = JSON.parse(message).state.reported
      commit(t.MIC_UPDATE_THINGS, {thingName, reported})

      if (state.selected.id == thingName)
        commit(t.MIC_UPDATE_OBSERVATION, reported)
    } catch (e) {
      console.log(e)
      return
    }
  },
}

const getters = {
  things: (state) => {
    return state.things
  },
  regThings: (state) => {
    return state.things.reduce((a, b) => {
      if (b.pos !== 'None,None')
        a.push(b)
      return a
    }, [])
  },
  unregThings: (state) => {
    return state.things.reduce((a, b) => {
      if (b.pos == 'None,None')
        a.push(b)
      return a
    }, [])
  },
  observed: (state) => {
    return state.observed
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
