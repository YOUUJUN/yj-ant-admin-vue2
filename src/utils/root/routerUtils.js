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

// 生成首页路由
export function generateIndexRouter(data) {
	let indexRouter = [
		{
			path: '/',
			name: 'dashboard',
			//component: () => import('@/components/layouts/BasicLayout'),
			component: (resolve) => require(['@components/Layout/Layout.vue'], resolve),
			meta: { title: '首页' },
			redirect: '/datas/datas',
			children: [
				// ...asyncRouterMap[0].children,
				...generateChildRouters(data),
			],
		},
		{
			path: '*',
			redirect: '/404',
			hidden: true,
		},
	]
	return indexRouter
}

// 生成嵌套路由（子路由）

function generateChildRouters(data) {
	const routers = []
	for (let item of data) {
		let component = ''
		if (item.component.indexOf('layouts') >= 0) {
			component = 'components/' + item.component
		} else {
			component = 'views/' + item.component
		}

		// eslint-disable-next-line
		let URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
		if (isURL(URL)) {
			item.meta.url = URL
		}

		let componentPath = (resolve) => require(['@/' + component + '.vue'], resolve)

		let menu = {
			path: item.path,
			name: item.name,
			redirect: item.redirect,
			component: componentPath,
			//component: resolve => require(['@/' + component+'.vue'], resolve),
			hidden: item.hidden,
			meta: {
				title: item.meta.title,
				icon: item.meta.icon,
				url: item.meta.url,
				permissionList: item.meta.permissionList,
				keepAlive: item.meta.keepAlive,
				/*update_begin author:wuxianquan date:20190908 for:赋值 */
				internalOrExternal: item.meta.internalOrExternal,
				/*update_end author:wuxianquan date:20190908 for:赋值 */
				componentName: item.meta.componentName,
			},
		}
		if (item.alwaysShow) {
			menu.alwaysShow = true
			menu.redirect = menu.path
		}
		if (item.children && item.children.length > 0) {
			menu.children = [...generateChildRouters(item.children)]
		}
		//--update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
		//判断是否生成路由
		if (item.route && item.route === '0') {
			//console.log(' 不生成路由 item.route：  '+item.route);
			//console.log(' 不生成路由 item.path：  '+item.path);
		} else {
			routers.push(menu)
		}
		//--update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
	}
	return routers
}
