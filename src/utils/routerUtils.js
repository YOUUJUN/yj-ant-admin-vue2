/**
 * 获取固定菜单
 */
export function getMenus(components = false, data = null) {
	let resData = []
	let tempdata = {}
	if (!components) {
		data = localRouterMap || []
	}
	data.forEach((item, index) => {
		tempdata = {
			name: item.name,
			path: item.path,
			redirect: null,
			route: '1',
			meta: {
				title: item.meta.title,
				keepAlive: false,
				icon: !components ? 'bar-chart' : '',
				componentName: !components ? 'RouteView' : item.name,
			},
			component: !components ? 'layouts/RouteView' : item.sub,
			id: Date.parse(new Date()) + item.name,
		}
		if (item.children && item.children.length > 0) {
			tempdata.children = getMenus(true, item.children)
		}
		resData.push(tempdata)
	})
	return resData
}
