import Vue from 'vue'
import Router from 'vue-router'
import Intro from '@/components/Intro'
import Current from '@/components/Current'
import Previous from '@/components/Previous'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Intro',
      component: Intro
    },
    {
      path: '/current',
      name: 'Current',
      component: Current
    },
    {
      path: '/previous',
      name: 'Previous',
      component: Previous
    }
  ]
})
