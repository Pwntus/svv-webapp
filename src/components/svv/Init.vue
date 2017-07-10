<template lang="pug">
#svv-init(v-if="!AppInited")
  .ball
    md-icon hourglass_full
  md-spinner.md-accent(
    :md-size="100"
    md-indeterminate
  )
</template>

<script>
export default {
  name: 'SvvInit'
}
</script>

<style lang="scss" scoped>
#svv-init {
  position: fixed;
  top: 0 ;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .5);
  z-index: 100;

  .ball {
    width: 76px;
    height: 76px;
    text-align: center;
    color: #FFF;
    margin: -38px 0 0 -38px;
    padding-top: 25px;
    position: fixed;
    top: 50%;
    left: 50%;
  }

  .md-spinner {
    margin: -50px 0 0 -50px;
    position: fixed;
    top: 50%;
    left: 50%;
  }
}
</style>
