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
		console.log('to.path', to)
		if (to.path === '/user/login') {
			next({ path: '/index' })
			NProgress.done()
		}else if(to.path === '/user/platform'){
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
							console.log('menuData', menuData)
							let constRoutes = generateIndexRouter(menuData)
							console.log('constRoutes', constRoutes)
							store.dispatch('permission/UpdateAppRouter', { constRoutes }).then((res) => {
								store.getters.permission_routers.forEach((route) => {
									router.addRoute(route)
								})
								console.log('to', to)
								next({ ...to, replace: true })
							})
						} else {
							console.log('false....')
							//如果code返回406说明当前token无法查询到登录用户的菜单权限（用户还未选择业务平台，前端路由跳转到选择业务平台页面）
							if(code === 406){
								console.log('in 406...')
								next({ path: '/user/platform' })
							}else{
								throw(res)
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
						next()
						NProgress.done()
					})
			} else {
				next()
				NProgress.done()
			}

			// const hasRoles = store.getters.roles && store.getters.roles.length > 0
			// if (hasRoles) {
			// 	next()
			// } else {
			// 	/*--如果没有，尝试获取--*/
			// 	try {
			// 		const { roles } = await store.dispatch('user/getInfo')

			// 		//通过权限列表动态生成前端路由
			// 		const accessedRoutes = await store.dispatch('permission/generateRoutes', roles)

			// 		accessedRoutes.forEach((route) => {
			// 			router.addRoute(route)
			// 		})

			// 		next({ ...to, replace: true })
			// 	} catch (err) {
			// 		/*--处理向后台请求用户信息接口错误--*/
			// 		await store.dispatch('user/resetToken')
			// 		next(`/login?redirect=${to.path}`)
			// 	}
			// }
		}
	} else {
		console.log('no token')
		/*no token*/
		if (whiteList.includes(to.path)) {
			console.log('1')
			next()
		} else {
			console.log('2')
			next({ path: '/user/login', query: { redirect: to.fullPath } })
		}
		NProgress.done()
	}
})

router.afterEach(() => {
	NProgress.done() // finish progress bar
})
