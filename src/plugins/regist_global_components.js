/**
 * 全局组件注册公共模块
 *
 */

import DictSelectTag from '@/components/Dict'

const ComponentsRegister = {
	install(Vue) {
		Vue.component('dict-select-tag', DictSelectTag)
	},
}

export default ComponentsRegister
