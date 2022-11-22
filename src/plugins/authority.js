import { USER_AUTH } from '@/utils/root/localStorageKeys'
import { getStorage } from '@/utils/lsOperation'

/**
 * 
 *  USER_AUTH :  { action: "usero:edit", describe: "用户编辑", type: "1", status: "1" }
 * 
 */
const AuthorityPlugin = {
	install(Vue) {
		Vue.directive('has', {
			inserted(el, binding, vnode) {
				const arg = binding.arg
				const check = binding.value
				const instance = vnode.context
                let result = this.$auth(check)
                if(result === false){
                    el.parentNode.removeChild(el);
                }else{
                    let {type} = result;
                    switch(type){
                        case '1':
                            el.parentNode.removeChild(el);
                            break;
                        case '2':
                            el.classList.add('disabled')
                            break;
                    }
                }
			},
		})

		Vue.mixin({
			methods: {
				/**
				 *
				 * @param {string} auth 权限名
				 * @param {number} type 授权策略 type=1 :可见/可访问(授权后可见/可访问); type=2 :可编辑(未授权时禁用)
				 */
				$auth(auth, type) {
                    const authList = getStorage(USER_AUTH)
                    const visibleTypeAuthList = authList.filter(item => item.type == '1')
                    const disableTypeAuthList = authList.filter(item => item.type == '2')
                    if(authList.findIndex(item => item.action === auth) !== -1){
                        let result = {
                            permission : true,
                        }
                        let ctrlType = '';
                        if(visibleTypeAuthList.findIndex(item => item.action === auth) !== -1){
                            ctrlType = '1'
                        }else if(disableTypeAuthList.findIndex(item => item.action === auth) !== -1){
                            ctrlType = '2'
                        }

                        type && (ctrlType = type)
                        
                        Object.assign(result, {
                            type : ctrlType
                        })

                        return result
                    }else{
                        return false
                    }
                },
			},
		})
	},
}

export default AuthorityPlugin
