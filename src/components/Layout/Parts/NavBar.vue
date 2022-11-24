<template>
	<div class="header">
		<section class="start">
			<img class="logo" src="@/assets/logo.png" />
			<span class="logo-text">老龄健康</span>
		</section>

		<section class="center">
			<div class="bread-wrap">
				<hamburger :is-active="!sidebar.opened" @toggleClick="toggleClick"></hamburger>
			</div>

			<div class="ctrl-wrap">
				<a class="ctrl-item" href="javascript:void(0);" target="_self">
					<span>返回首页</span>
				</a>

				<div class="ctrl-item">
					<a-icon class="ctrl-icon" type="fullscreen" />
				</div>

				<a-dropdown v-model="visible">
					<a class="ctrl-item ant-dropdown-link" @click="(e) => e.preventDefault()">
						安徽省老龄健康处
						<a-icon type="caret-down" />
					</a>
					<a-menu slot="overlay" @click="handleMenuClick">
						<a-menu-item key="1">退出登录</a-menu-item>
					</a-menu>
				</a-dropdown>
			</div>
		</section>

		<section class="end">
			<div class="avatar-wrap"></div>
		</section>
	</div>
</template>

<script>
const hamburger = () => import('@/components/Hamburger/Index.vue')

import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'NavBar',

	components: {
		hamburger,
	},

	data() {
		return {
			visible: false,
		}
	},

	computed: {
		...mapGetters(['sidebar']),
	},

	methods: {
		...mapActions('display', ['toggleSideBar']),

		...mapActions('user', ['Logout']),

		toggleClick() {
			this.toggleSideBar()
		},

		handleMenuClick(e) {
			if (e.key === '1') {
				this.handleLogOut()
				this.visible = false
			}
		},

		//处理退出登录
		async handleLogOut() {
			await this.Logout()
			this.$router.push({ path: '/user/login' })
		},
	},
}
</script>

<style></style>

<style scoped>
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	line-height: 100%;
	border-bottom: 0.1rem solid #f5f5f5;
	box-sizing: border-box;
}

.header .start,
.header .center,
.header .end {
	display: inline-flex;
	height: 100%;
}

.start {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24rem;
	flex: none;
}

.start .logo {
	width: auto;
	height: 3.8rem;
}

.start .logo-text {
	font-family: '微软雅黑';
	font-weight: 400;
	font-size: 1.8rem;
	color: #979797;
	margin-left: 1rem;
}

.center {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex: auto;
	margin-left: 1.4rem;
	margin-right: 0;
}

.bread-wrap {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.bread-nav {
	margin-left: 1.5rem;
}

.ctrl-wrap {
	display: flex;
	flex-direction: row;
	height: 100%;
}

.ctrl-wrap .ctrl-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 100%;
	padding: 0 1.2rem;
	font-size: 1.5rem;
	color: #979797;
	cursor: pointer;
}

.ctrl-wrap .ctrl-item:hover {
	background-color: rgba(0, 0, 0, 0.025);
}

.ctrl-item .ctrl-icon {
	font-size: 2rem;
}

.end {
	flex: none;
	margin-left: 1.5rem;
	margin-right: 1.8rem;
}

.avatar-wrap {
	display: inline-flex;
	height: 100%;
	line-height: 100%;
	align-items: center;
	cursor: pointer;
}
</style>
