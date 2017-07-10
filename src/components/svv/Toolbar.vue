<template lang="pug">
#svv-toolbar
  md-toolbar.md-dense.md-transparent(:class="{ scrolled }")
    h2.md-title(
      @click="$router.push('/')"
    ) Statens vegvesen
    .flex
    md-button.md-primary(
      v-if="user == -1 && userInited"
      @click.native="$router.push('/')"
    ) Sign In
    md-button.md-primary(
      v-if="user !== -1 && userInited"
      @click.native="$router.push('/logout')"
    ) Logout
</template>

<script>
export default {
  name: 'SvvToolbar',
  data () {
    return {
      scrolled: false
    }
  },
  methods: {
    handleScroll () {
      this.scrolled = window.scrollY > 0
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="scss" scoped>
#svv-toolbar {
  z-index: 110;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  .md-toolbar {
    background-color: #FFF;

    &.scrolled {
      -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
    }

    .md-title {
      cursor: pointer;
    }
  }
}
</style>
