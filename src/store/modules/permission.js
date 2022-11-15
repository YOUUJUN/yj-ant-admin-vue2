import { asyncRouters, constantRoutes } from '@/router'

const state = {
	routes: constantRoutes,
	addRoutes: [],
}

const mutations = {
	SET_ROUTERS: (state, routes) => {
		state.addRoutes = routes
		state.routes = constantRoutes.concat(routes)
	},
}

const actions = {
	//通过角色过滤路由
	generateRoutes({ commit }, roles) {
		return new Promise((resolve, reject) => {
			let accessedRoutes = []
			if (roles.includes('admin')) {
				accessedRoutes = asyncRouters || []
			} else {
				accessedRoutes = filterAsyncRoutes(asyncRouters, roles)
			}

			commit('SET_ROUTES', accessedRoutes)
			resolve(accessedRoutes)
		})
	},

	//直接通过后端数据生成路由
	UpdateAppRouter({ commit }, routes) {
		return new Promise((resolve) => {
			let routelist = routes.constRoutes
			commit('SET_ROUTERS', routelist)
			resolve()
		})
	},
}

function filterAsyncRoutes(routes, roles) {
	const result = []
	routes.forEach((route) => {
		let tem = { ...route }
		if (hasPrermission(tem, roles)) {
			if (tem.children) {
				tem.children = filterAsyncRoutes(tem.children, roles)
			}
			result.push(route)
		}
	})

	return result
}

//从路由元信息roles判断
function hasPrermission(route, roles) {
	if (route.meta && route.meta.roles) {
		return roles.some((role) => {
			return route.meta.roles.includes(role)
		})
	} else {
		return true
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
