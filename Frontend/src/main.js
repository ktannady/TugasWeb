import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import Index from './components/todoList.vue'
import addTodo from './components/addTodo.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [ 
  {
    name: 'Index',
    path: '/',
    component: Index
  },
  {
    name: 'Add',
    path: '/add',
    component: addTodo
  },
];

const router = new VueRouter({ mode: 'history', routes: routes })

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')   