import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/view/Login'
import Logout from '@/components/view/Logout'
import Dashboard from '@/components/view/Dashboard'
import Summary from '@/components/view/sub/Summary'
import Offline from '@/components/view/sub/Offline'
import Verbose from '@/components/view/sub/Verbose'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Login },
    { path: '/logout', component: Logout },
    { path: '/dashboard', component: Dashboard,
      children: [
        { path: '', component: Summary },
        { path: 'offline', component: Offline },
        { path: ':id', component: Verbose }
      ]
    }
  ]
})
