<template lang="pug">
</template>

<script>
export default {
  name: 'Logout',
  mounted () {
    this.$store.dispatch('App/logout')
    this.$router.push('/')
  }
}
</script>

<style lang="scss">
</style>
