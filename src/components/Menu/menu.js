import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'
import svgIcon from '@/components/SvgIcon'
import { equal } from '@/utils/index'

const { Item, SubMenu } = Menu

function toRoutesMap(routes) {
	const map = {}
	routes.forEach((route) => {
		map[route.fullPath] = route
		if (route?.children?.length > 0) {
			let childrenMap = toRoutesMap(route.children)
			Object.assign(map, childrenMap)
		}
	})
	return map
}

function resolvePath(path, params = {}) {
	let _path = path
	Object.entries(params).forEach(([key, value]) => {
		_path = _path.replace(new RegExp(`:${key}`, 'g'), value)
	})
	return _path
}

export default {
	name: 'VMenu',
	props: {
		options: {
			type: Array,
			required: true,
		},
		theme: {
			type: String,
			required: false,
			default: 'light',
		},
		mode: {
			type: String,
			required: false,
			default: 'inline',
		},
		collapsed: {
			type: Boolean,
			required: false,
			default: false,
		},
		openKeys: Array,
	},

	data() {
		return {
			selectedKeys: [],
			sOpenKeys: [],
			cachedOpenKeys: [],
		}
	},

	computed: {
		menuTheme() {
			return this.theme == 'light' ? this.theme : 'dark'
		},

		routesMap() {
			return toRoutesMap(this.options)
		},
	},

	watch: {
		options: {
			handler(val) {
				if (val.length > 0 && !val?.[0]?.fullPath) {
					this.formatOptions(this.options, '')
				}
			},
			immediate: true,
		},

		$route() {
			this.updateMenu()
		},

		collapsed(val) {
			if (val) {
				this.cachedOpenKeys = this.sOpenKeys
				this.sOpenKeys = []
			} else {
				this.sOpenKeys = this.cachedOpenKeys
			}
		},

		sOpenKeys(val) {
			this.$emit('openChange', val)
			this.$emit('update:openKeys', val)
		},
	},

	created() {
		this.updateMenu()
	},

	methods: {
		formatOptions(options, parentPath) {
			options.forEach((route) => {
				let isFullPath = route.path.substring(0, 1) === '/'
				route.fullPath = isFullPath ? route.path : parentPath + '/' + route.path
				if (route?.children?.length > 0) {
					this.formatOptions(route.children, route.fullPath)
				}
			})
		},

		updateMenu() {
			this.selectedKeys = this.getSelectedKeys()
			let openKeys = this.selectedKeys.filter((item) => item !== '')
			openKeys.slice(0, openKeys.length - 1)
			if (!equal(openKeys, this.sOpenKeys)) {
				this.collapsed || this.mode === 'horizontal'
					? (this.cachedOpenKeys = openKeys)
					: (this.sOpenKeys = openKeys)
			}
		},

		getSelectedKeys() {
			let matches = this.$route.matched
			const route = matches[matches.length - 1]
			let choose = this.routesMap[route.path]
			if (choose?.meta?.highlight) {
				choose = this.routesMap[choose?.meta?.highlight]
				const resolve = this.$router.resolve({
					path: choose.fullPath,
				})
				matches = (resolve.resolved && resolve.resolved.matched) || matches
			}

			return matches.map((item) => item.path)
		},

		renderMenu(h, menuTree) {
			let menuArr = []
			menuTree.forEach((menu, index) => {
				menuArr.push(this.renderItem(h, menu, '0', index))
			})
			return menuArr
		},

		renderItem(h, menu) {
			const meta = menu?.meta
			if (!meta || !menu?.hidden) {
				let renderChildren = false
				const children = menu.children
				if (children?.length > 0) {
					if (children.find((item) => item?.hidden !== true)) {
						renderChildren = true
					}
				}

				return menu.children && renderChildren && !menu.alwaysShow
					? this.renderSubMenu(h, menu)
					: this.renderMenuItem(h, menu)
			}
		},

		renderSubMenu(h, menu) {
			let subItem = [
				h(
					'span',
					{
						slot: 'title',
						attrs: {
							style: 'overflow:hidden;white-space:normal;text-overflow:clip;',
						},
					},
					[this.renderIcon(h, menu?.meta ? menu?.meta?.icon : 'none', menu?.fullPath), menu?.meta?.title],
				),
			]

			let itemArr = []
			menu.children.forEach((item) => {
				itemArr.push(this.renderItem(h, item))
			})

			return h(
				SubMenu,
				{
					key: menu.fullPath,
				},
				subItem.concat(itemArr),
			)
		},

		renderMenuItem(h, menu) {
			let tag = 'router-link'
			const path = resolvePath(menu.fullPath, menu?.meta?.params)
			let config = {
				props: {
					to: {
						path,
						query: menu?.meta?.query,
					},
					attrs: {
						style: 'overflow:hidden;white-space:normal;text-overflow:clip;',
					},
				},
			}

			if (menu?.meta?.link) {
				tag = 'a'
				config = {
					attrs: {
						style: 'overflow:hidden;white-space:normal;text-overflow:clip;',
						href: menu?.meta?.link,
						target: '_blank',
					},
				}
			}

			return h(
				Item,
				{
					key: menu.fullPath,
				},
				[
					h(tag, config, [
						this.renderIcon(h, menu?.meta ? menu?.meta?.icon : 'none', menu.fullPath),
						h('span', {}, menu?.meta?.title),
					]),
				],
			)
		},

		renderIcon(h, icon, key) {
			if (this.$scopedSlots.icon && icon && icon !== 'none') {
				const vnodes = this.$scopedSlots.icon({ icon, key })
				vnodes.forEach((vnode) => {
					vnode.data.class = vnode.data.class ? vnode.data.class : []
					vnode.data.class.push('anticon')
				})
				return vnodes
			}

			if (!icon || icon === 'none') {
				return
			} else if (icon.startsWith('diy_')) {
				return h(svgIcon, {
					props: {
						iconClass: icon.replace('diy_', ''),
					},
					attrs: {
						style : 'margin-right:1rem;'
					}
				})
			} else {
				return h(Icon, {
					props: {
						type: icon,
					},
				})
			}
		},
	},

	render(h) {
		return h(
			Menu,
			{
				props: {
					theme: this.menuTheme,
					mode: this.$props.mode,
					selectedKeys: this.selectedKeys,
					openKeys: this.openKeys ? this.openKeys : this.sOpenKeys,
					inlineCollapsed: this.$props.collapsed,
				},
				on: {
					'update:openKeys': (val) => {
						this.sOpenKeys = val
					},
					click: (obj) => {
						obj.selectedKeys = [obj.key]
						this.$emit('select', obj)
					},
				},
			},
			this.renderMenu(h, this.options),
		)
	},
}
