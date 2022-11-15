const getters = {
	permissionList : state => state.user.permissionList,
	permission_routers : state => state.permission.routes,
	sidebar: (state) => state.display.sidebar,
}

export default getters
