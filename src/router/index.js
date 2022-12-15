import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@components/Layout/Layout.vue'
import BlankLayout from '@/components/Layout/BlankLayout.vue'

Vue.use(VueRouter)

//不变的路由配置，不参与菜单项构建
export const constantRoutes = [
	{
		path: '/user',
		redirect: '/user/login',
		component: BlankLayout,
		children: [
			{
				path: 'login',
				name: 'login',
				component: () => import('@/views/login'),
			},
		],
	},

	{
		path: '/403',
		name: '403',
		component: () => import('@/views/exception/403.vue'),
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@/views/exception/404.vue'),
	},
	{
		path: '/500',
		name: '500',
		component: () => import('@/views/exception/500.vue'),
	},

]

//会读取作为菜单项的路由配置
export const asyncRouters = [
	{
		name: 'menu-manage',
		path: '/system/menu-manage',
		component: () => import('@/views/system/menu-manage'),
		meta: {
			icon: 'alert',
			internalOrExternal: false,
			keepAlive: false,
			title: '菜单管理',
		},
	},

	{
		name: 'user-manage',
		path: '/system/user-manage',
		component: () => import('@/views/system/user-manage'),
		meta: {
			icon: 'alert',
			internalOrExternal: false,
			keepAlive: false,
			title: '用户管理',
		},
	},

	{
		name: 'role-manage',
		path: '/system/role-manage',
		component: () => import('@/views/system/role-manage'),
		meta: {
			icon: 'alert',
			internalOrExternal: false,
			keepAlive: false,
			title: '角色管理',
		},
	},

	{
		name: 'dict-manage',
		path: '/system/dict-manage',
		component: () => import('@/views/system/dict-manage'),
		meta: {
			icon: 'alert',
			internalOrExternal: false,
			keepAlive: false,
			title: '数据字典',
		},
	},

	{
		name: 'operation-log',
		path: '/system/operation-log',
		component: () => import('@/views/system/operation-log'),
		meta: {
			icon: 'alert',
			internalOrExternal: false,
			keepAlive: false,
			title: '操作日志',
		},
	},
]

const router = new VueRouter({
	mode: 'history',
	base: window._CONFIG['baseURL'],
	routes: constantRoutes,
})

export default router
