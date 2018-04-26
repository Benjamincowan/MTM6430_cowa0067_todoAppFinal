import Vue from 'vue'
import Router from 'vue-router'
import AllTasksPage from '@/pages/AllTasksPage'
import ActiveTasksPage from '@/pages/ActiveTasksPage'
import CompletedTasksPage from '@/pages/CompletedTasksPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Active',
      component: ActiveTasksPage
    },
    {
      path: '/all',
      name: 'AllTasksPage',
      component: AllTasksPage
    },
    {
      path: '/completed',
      name: 'Completed',
      component: CompletedTasksPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
