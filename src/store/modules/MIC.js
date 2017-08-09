import Vue from 'vue'
import * as t from '@/store/mutation-types'
import { MIC } from '@/lib/MIC'
import { MIC_THING_TYPE_ID } from '@/config'

const state = {
  things: [],
  observed: {
    id: null,
    timestamp: [],
    bat: [],
    hum: [],
    tmp: []
  }
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

  [t.MIC_SET_THINGS_POS] (state, hits) {
    let positions = {}
    hits.forEach(hit => {
      positions[hit._source.thingName] = hit._source.state.pos
    })

    state.things.forEach(thing => {
      if (typeof positions[thing.id] === 'undefined')
        return
      thing.pos = (positions[thing.id] !== 'None,None') ? positions[thing.id] : thing.pos
    })
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
    

    // Find subject
    for (let i in state.things) {
      if (state.things[i].id == thingName) {
        state.things[i] = {
          id: thingName,
          bat: parseFloat(reported.bat),
          hum: parseFloat(reported.hum),
          tmp: parseFloat(reported.tmp),
          pos: (reported.pos == 'None,None') ? state.things[i].pos : reported.pos,
          timestamp: reported.timestamp
        }
        let copy = state.things.slice(0)
        state.things = copy
        return
      }
    }

    // Unknown subject, add it
    state.things.push({
      id: thingName,
      bat: parseFloat(reported.bat),
      hum: parseFloat(reported.hum),
      tmp: parseFloat(reported.tmp),
      pos: reported.pos,
      timestamp: reported.timestamp
    })
  },

  [t.MIC_UPDATE_OBSERVATION] (state, reported) {
    state.observed.timestamp.push(reported.timestamp)
    state.observed.bat.push(parseFloat(reported.bat))
    state.observed.hum.push(parseFloat(reported.hum))
    state.observed.tmp.push(parseFloat(reported.tmp))
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
        return dispatch('initPos')
      })
      .catch(err => { return Promise.reject(err) })
  },

  initPos ({commit, state}) {
    let thingNames = state.things.reduce((a, b) => {
      a.push(b.id)
      return a
    }, [])

    thingNames.forEach(thingName => {
      let payload = {
        action: 'FIND',
        query: {
          size: 1,
          _source: ['state.pos', 'timestamp', 'thingName'],
          sort: { timestamp: { order: 'desc' } },
          filter: {
            bool: {
              must: [
                { terms: { thingName: [thingName] } },
                { range: { timestamp: {
                  gte: (Date.now() - 360 * 24 * 60 * 60 * 1000),
                  lte: Date.now()
                } } },
                { exists: { field: 'state.pos' } }
              ],
              must_not: [
                { match: { 'state.pos': 'None,None' } }
              ],
              minimum_should_match: 1
            } } } }

      return MIC.invoke('ObservationLambda', payload)
        .then(data => { return data.hits.hits })
        .then(hits => {
          commit(t.MIC_SET_THINGS_POS, hits)
          return Promise.resolve()
        })
        .catch(err => { return Promise.reject(err) })
    })
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
                gte: (Date.now() - 2 * 24 * 60 * 60 * 1000),
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

      // Hack, filter out undesired things
      if (thingName !== '00000618' && thingName !== '00000625' && thingName !== '00000562')
        return

      let reported = JSON.parse(message).state.reported
      commit(t.MIC_UPDATE_THINGS, {thingName, reported})

      if (state.observed.id == thingName)
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
    let inactive = + new Date() - 1 * 60 * 60 * 1000

    return state.things.reduce((a, b) => {
      if (b.pos !== 'None,None' && b.timestamp > inactive)
        a.push(b)
      return a
    }, [])
  },
  unregThings: (state) => {
    let inactive = + new Date() - 1 * 60 * 60 * 1000

    return state.things.reduce((a, b) => {
      if (b.pos == 'None,None' || b.timestamp <= inactive)
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
