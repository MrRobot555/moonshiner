import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

Vue.use(VueRouter);

Vue.config.productionTip = false

Vue.use(BootstrapVue)

Vue.use(IconsPlugin)


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css' 

new Vue({
  render: h => h(App),
}).$mount('#app')
