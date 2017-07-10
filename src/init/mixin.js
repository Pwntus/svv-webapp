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
      appInited:  'App/inited',
      userInited: 'App/userInited',
      user:       'App/getUser'
    })
  },
  methods: {
    showSnackbar (message = null) {
      this.eventBus.$emit('svv:snackbar', message)
    }
  }
})
