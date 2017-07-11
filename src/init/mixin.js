import Vue from 'vue'
import { mapGetters } from 'vuex'

const eventBus = new Vue()

Vue.mixin({
  data () {
    return {
      eventBus
    }
  },
  computed: {
    ...mapGetters({
      AppInited:  'App/inited',
      AppUser:    'App/user',
      MicThings:  'MIC/things',
      MicRegThings:  'MIC/regThings',
      MicUnregThings:  'MIC/unregThings'
    })
  },
  methods: {
    showSnackbar (message = null) {
      this.eventBus.$emit('svv:snackbar', message)
    }
  }
})
