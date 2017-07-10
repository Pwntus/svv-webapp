<template lang="pug">
#svv-dashboard(v-if="userInited")
  svv-map
  b Registered things
  .foo {{ $store.getters['MIC/regThings'] }}
  b Unregistered things
  .foo {{ $store.getters['MIC/unregThings'] }}
</template>

<script>
import SvvMap from '@/components/svv/Map'
import { MQTT } from '@/lib/MQTT'

export default {
  name: 'SvvLogin',
  components: { SvvMap },
  data () {
    return {
    }
  },
  watch: {
    user: function (val) {
      if (val == -1)
        this.$router.push('/')
    },
    userInited: function (val) {
      if (val) {
        MQTT.init(this)
        this.$store.dispatch('MIC/getThings')
      }
    }
  }
}
</script>

<style lang="scss">
#svv-dashboard {
  position: relative;
  z-index: 1;
}
</style>
