<template lang="pug">
#svv-login(v-if="userInited")
  svv-card(
    :loading="loading"
    :hidden="false"
  )
    md-card-header
      .md-title Login
      .md-subhead v0.1

    md-card-content
      md-input-container
        label Username
        md-input(
          v-model="username"
          :disabled="loading"
          @keyup.enter.native="login"
        )
      md-input-container(md-has-password)
        label Password
        md-input(
          type="password"
          v-model="password"
          :disabled="loading"
          @keyup.enter.native="login"
        )
    md-card-actions
      md-button(
        :disabled="loading"
        @click.native="login"
      ) Login
</template>

<script>
import SvvCard from '@/components/svv/Card'

export default {
  name: 'SvvLogin',
  components: { SvvCard },
  data () {
    return {
      username: '',
      password: '',
      loading: false
    }
  },
  watch: {
    user: function (val) {
      if (val !== -1)
        this.$router.push('/dashboard')
    }
  },
  methods: {
    login () {
      if (this.username == '' || this.password == '') return
        
      this.loading = true
      let payload = {username: this.username, password: this.password }
      this.$store.dispatch('Auth/login', payload)
        .then(() => {
          this.$router.push('/dashboard')
        })
        .catch(error => {
          this.showSnackbar(error)
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
#svv-login {

  .svv-card {
    width: 400px;
    margin: 200px auto 100px;
  }
}
</style>
