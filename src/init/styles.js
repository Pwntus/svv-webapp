import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial)

import '@/../node_modules/vue-material/dist/vue-material.css'
import '@/../node_modules/leaflet/dist/leaflet.css'
import '@/../node_modules/c3/c3.css'
import '@/assets/css/global.scss'

Vue.material.registerTheme('default', {
  primary: {
    color: 'orange',
    hue: '500'
  },
  accent: 'deep-orange',
  warn: 'red',
  background: 'white'
})

Vue.material.registerTheme('toolbar', {
  primary: 'white',
  background: 'blue-grey'
})
