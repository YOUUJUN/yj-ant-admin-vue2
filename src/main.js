import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Request from '@/utils/http.js'
//vue2.0 template 链运算符使用 
import {useChain} from "@/utils/index.js"

import '@/permission' // permission control


import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);


Vue.config.productionTip = false;

/*---init axios---*/
Vue.prototype.$request = Request;

Vue.prototype.$bus = new Vue();
Vue.prototype.$useChain = useChain;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
