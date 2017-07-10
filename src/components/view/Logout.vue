<template lang="pug">
</template>

<script>
export default {
  name: 'SvvLogout',
  mounted () {
    this.$store.dispatch('Auth/logout')
    this.$router.push('/')
  }
}
</script>

<style lang="scss">
</style>
