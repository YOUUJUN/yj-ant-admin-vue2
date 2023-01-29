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
	
	//直接通过后端数据生成路由
	UpdateAppRouter({ commit }, routes) {
		return new Promise((resolve) => {
			let routelist = routes.constRoutes
			commit('SET_ROUTERS', routelist)
			resolve()
		})
	},
}


export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
