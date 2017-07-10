import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/view/Login'
import Logout from '@/components/view/Logout'
import Dashboard from '@/components/view/Dashboard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Login },
    { path: '/logout', component: Logout },
    { path: '/dashboard', component: Dashboard }
  ]
})
