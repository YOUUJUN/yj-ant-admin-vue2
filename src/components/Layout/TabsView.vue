<template>
	<section>
		<a-tabs :active-key="activePage" class="tab-layout-tabs" :hide-add="true" type="editable-card"
			@change="handleTabChange" @tabClick="handleTabClick" @edit="handleEdit" :style="{left: sidebar.width + 'px'}">
			<a-tab-pane :id="page.fullPath" :key="page.fullPath" v-for="page in pageList"
				:closable="!($useChain(page)['meta?.title'] == '首页')">
				<span slot="tab" :pagekey="page.fullPath">{{ $useChain(page)['meta?.title'] }}</span>
			</a-tab-pane>
		</a-tabs>

		<div class="tabs-view-content">
			<page-transition>
				<keep-alive v-if="$route.meta.keepAlive">
					<router-view></router-view>
				</keep-alive>

				<router-view v-else></router-view>
			</page-transition>
		</div>
	</section>
</template>

<script>
const PageTransition = () => import('@/components/Transition/PageTransition')
import {mapGetters} from 'vuex'

export default {
	name: 'TabLayout',
	components: {
		PageTransition,
	},

	data() {
		//首页path
		this.indexKey = '/'

		return {
			pageList: [],
			linkList: [],
			activePage: '',
		}
	},

	computed: {
		...mapGetters(['sidebar']),
	},

	watch: {
		$route: {
			handler(newRoute) {
				this.handleRouteChange(newRoute)
			},
		},

		activePage: {
			handler(key) {
				let gotoRoute = this.pageList.find((page) => {
					return page.fullPath === key
				})

				if (gotoRoute && gotoRoute.fullPath !== this.$route.fullPath) {
					this.$router
						.push({
							path: gotoRoute.fullPath,
						})
						.catch((err) => { })
				}
			},
		},
	},

	created() {
		if (this.$route.path !== this.indexKey) {
			this.setIndexAsFirst()
		}
		this.initData()
	},


	methods: {
		//初始化tab栏
		initData() {
			let currentRoute = Object.assign({}, this.$route)
			currentRoute.meta = Object.assign({}, currentRoute.meta)

			this.pageList.push(currentRoute)
			this.linkList.push(currentRoute.fullPath)
			this.activePage = currentRoute.fullPath
		},

		//监听路由刷新
		handleRouteChange(newRoute) {
			let newPath = newRoute.fullPath
			this.activePage = newPath

			//判断新路由是否为首页
			if (newPath === this.indexKey) {
				if (!newRoute?.meta?.keepAlive) {
					this.reloadRoute()
				}
			} else {
				if (this.linkList.includes(newPath)) {
					let oldRouteIndex = this.pageList.findIndex((page) => {
						return page.fullPath === newPath
					})
					let oldRoute = this.pageList[oldRouteIndex]
					this.pageList.splice(
						oldRouteIndex,
						1,
						Object.assign({}, newRoute, {
							meta: oldRoute.meta,
						}),
					)
				} else {
					this.pageList.push(Object.assign({}, newRoute))
					this.linkList.push(newPath)
				}
			}
		},

		//设置首页为第一个tab栏
		setIndexAsFirst() {
			this.pageList.splice(0, 0, {
				name: 'Index',
				path: this.indexKey,
				fullPath: this.indexKey,
				meta: {
					title: '首页',
				},
			})
			this.linkList.splice(0, 0, this.indexKey)
		},

		//监听tab页改变
		handleTabChange(key) {
			this.activePage = key
		},

		//监听tab编辑
		handleEdit(targetKey, action) {
			if (action === 'remove') {
				this.handleTabRemove(targetKey)
			}
		},

		//处理关闭tab
		handleTabRemove(key) {
			if (key === this.indexKey) {
				this.$message.warning('首页不能关闭!')
				return
			}

			if (this.pageList.length === 1) {
				this.$message.warning('这是最后一页，不能再关闭了啦')
				return
			}

			let removeIndex = this.linkList.findIndex((link) => link === key)
			this.pageList = this.pageList.filter((page) => page.fullPath !== key)
			this.linkList = this.linkList.filter((link) => link !== key)
			let nextIndex = removeIndex >= this.linkList.length ? this.linkList.length - 1 : removeIndex
			this.activePage = this.linkList[nextIndex]
		},

		//监听tab点击事件
		handleTabClick() { },

		//刷新路由
		reloadRoute() { },
	},
}
</script>

<style>
.tab-layout-tabs .ant-tabs-bar {
	margin: 1rem 2.4rem 0;
}
</style>

<style scoped>
.tab-layout-tabs {
	position: fixed;
	top: 6rem;
	right: 0;
	left: 24rem;
	background: #f0f2f5;
	opacity: 1;
	z-index: 999;
	transition: all 0.2s;
}

.tabs-view-content {
	margin: 5rem 2.4rem 2.4rem;
	border-radius: 0.4rem;
	overflow: hidden;
	box-shadow: -0.1rem -0.1rem 0.5rem 0 rgba(0, 0, 0, 0.1);
	background: #fff;
}
</style>
