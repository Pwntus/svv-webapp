<template lang="pug">
#svv-map
  svv-leaflet
</template>

<script>
import SvvLeaflet from '@/components/svv/Leaflet'

export default {
  name: 'SvvMap',
  components: { SvvLeaflet },
  computed: {
    things () {
      return this.$store.getters['MIC/things']
    }
  }
}
</script>

<style lang="scss">
#svv-map {
  width: 100%;
  height: 500px;
}
</style>
