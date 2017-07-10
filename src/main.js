import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import App from '@/components/App'
import '@/init'


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
