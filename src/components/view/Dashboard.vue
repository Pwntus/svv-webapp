<template lang="pug">
#svv-dashboard
  svv-map
  router-view
</template>

<script>
import SvvMap from '@/components/svv/Map'
import { MQTT } from '@/lib/MQTT'

export default {
  name: 'Dashboard',
  components: { SvvMap },
  mounted () {
    if (this.AppUser == null) {
      this.$router.push('/')
      return
    }

    MQTT.init(this)
    this.$store.dispatch('MIC/init')
      .catch(err => {
        console.log(err)
        this.$router.push('/logout')
      })
  }
}
</script>

<style lang="scss">
#svv-dashboard {
  height: 100%;
  position: relative;
  z-index: 1;
}
</style>
