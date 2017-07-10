<template lang="pug">
#app
  svv-init
  svv-snackbar
  svv-toolbar
  router-view(v-if="AppInited")
</template>

<script>
import SvvInit from '@/components/svv/Init'
import SvvToolbar from '@/components/svv/Toolbar'
import SvvSnackbar from '@/components/svv/Snackbar'

export default {
  name: 'App',
  components: {
    SvvInit,
    SvvToolbar,
    SvvSnackbar
  },
  mounted () {
    this.$store.dispatch('App/init')
  }
}
</script>

<style lang="scss" scoped>
#app {
  padding-top: 48px;
}
</style>
