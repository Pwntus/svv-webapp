<template lang="pug">
#svv-toolbar
  md-toolbar.md-dense(
    :class="{ scrolled }"
    md-theme="toolbar"
  )
    img(src="../../assets/tmp.png")
    h2.md-title(
      @click="$router.push('/')"
    ) Road Monitoring
    .flex
    md-button.md-primary(
      v-if="!AppUser"
      @click.native="$router.push('/')"
    ) Sign In
    md-button.md-icon-button.md-primary(
      v-if="AppUser"
      @click.native="$router.push('/dashboard/offline')"
    )
      md-icon portable_wifi_off
      md-tooltip(md-direction="bottom") Inactive Sensors
    md-button.md-icon-button.md-primary(
      v-if="AppUser"
      @click.native="$router.push('/logout')"
    )
      md-icon exit_to_app
      md-tooltip(md-direction="bottom") Log Out
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
    background-color: rgba(68, 79, 85, 1);

    &.scrolled {
      -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
    }

    img {
      margin-right: 5px;
    }

    .md-title {
      color: #FFF;
      cursor: pointer;
    }
  }
}
</style>
