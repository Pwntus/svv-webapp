<template lang="pug">
md-snackbar(
  md-position="top center"
  ref="snackbar"
)
  span {{ message }}
</template>

<script>
export default {
  name: 'SvvSnackbar',
  data () {
    return {
      message: null
    }
  },
  created () {
    this.eventBus.$on('svv:snackbar', (message) => {
      this.message = message
      this.$refs.snackbar.open()
    })
  },
  beforeDestroy () {
    this.eventBus.$off('svv:snackbar')
  }
}
</script>

<style lang="scss" scoped>
</style>
