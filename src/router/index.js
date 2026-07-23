import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Register from '../views/Register.vue';
import MembersList from '../views/members/MembersList.vue';
import Dashboard from '../views/dashboard/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/members',
    name: 'Members List',
    component: MembersList
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router