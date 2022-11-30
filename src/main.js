import Vue from 'vue'
import '@/config'	//导入应用基本配置
import Storage from 'vue-ls'
import App from './App.vue'
import router from './router'
import store from './store'
import Request from '@/utils/http.js'
//vue2.0 template 链运算符使用
import { useChain } from '@/utils/index.js'

import '@/icons' //导入所有svg

import '@/permission' // permission control

//导入全局组件
import ComponentsRegister from '@/plugins/regist-global-components'
Vue.use(ComponentsRegister)

import AuthorityPlugin from '@/plugins/authority'
Vue.use(AuthorityPlugin)

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)
import 'moment/locale/zh-cn'

//添加localStorage工具
Vue.use(Storage, {
	namespace: 'pro__',
	name: 'ls',
	storage: 'local',
})

Vue.config.productionTip = false

/*---init axios---*/
Vue.prototype.$request = Request

Vue.prototype.$bus = new Vue()
Vue.prototype.$useChain = useChain

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app')
