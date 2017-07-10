<template lang="pug">
#svv-login
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
  name: 'Login',
  components: { SvvCard },
  data () {
    return {
      username: '',
      password: '',
      loading: false
    }
  },
  methods: {
    login () {
      if (this.username == '' || this.password == '') return
        
      this.loading = true
      let payload = {username: this.username, password: this.password }
      this.$store.dispatch('App/login', payload)
        .then(() => {
          this.$router.push('/dashboard')
        })
        .catch(err => {
          this.showSnackbar(err)
          this.loading = false
        })
    }
  },
  mounted () {
    if (this.AppUser !== null)
      this.$router.push('/dashboard')
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
