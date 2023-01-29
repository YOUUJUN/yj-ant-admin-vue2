import router from '@/router'
import store from '@/store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import { getToken } from '@/utils/ls_operation'
import { generateIndexRouter } from '@/utils/root/router_utils'

const whiteList = ['/user/login']

router.beforeEach(async (to, from, next) => {
	NProgress.start() // start progress bar
	/* must call `next` */
	const hasToken = getToken()
	if (hasToken) {
		if (to.path === '/user/login') {
			next({ path: '/index' })
			NProgress.done()
		} else if (to.path === '/user/platform') {
			next()
			NProgress.done()
		} else {
			/*--从VUEX中判断是否有权限--*/
			if (store.getters.permissionList.length === 0) {
				store
					.dispatch('user/GetPermissionList')
					.then((res) => {
						const { success, result, code } = res
						if (success) {
							const menuData = result?.menu
							if (!menuData) {
								return
							}
							let constRoutes = generateIndexRouter(menuData)
							console.log('constRoutes', constRoutes)
							store.dispatch('permission/UpdateAppRouter', { constRoutes }).then((res) => {
								store.getters.permission_routers.forEach((route) => {
									router.addRoute(route)
								})
								console.log('to', to)
								next({ ...to })
							})
						} else {
							console.log('false....')
							//如果code返回406说明当前token无法查询到登录用户的菜单权限（用户还未选择业务平台，前端路由跳转到选择业务平台页面）
							if (code === 406) {
								console.log('in 406...')
								next({ path: '/user/platform' })
							} else {
								next({ path: '/user/login' })
								throw res
							}
						}
					})
					.catch((err) => {
						console.error('构建菜单失败', err)
						store.dispatch('user/Logout').then((res) => {
							next({ path: '/user/login', query: { redirect: to.fullPath } })
						})
					})
					.finally(() => {
						NProgress.done()
					})
			} else {
				next()
				NProgress.done()
			}
		}
	} else {
		console.log('no token')
		/*no token*/
		if (whiteList.includes(to.path)) {
			next()
		} else {
			next({ path: '/user/login', query: { redirect: to.fullPath } })
		}
		NProgress.done()
	}
})

router.afterEach(() => {
	NProgress.done() // finish progress bar
})
