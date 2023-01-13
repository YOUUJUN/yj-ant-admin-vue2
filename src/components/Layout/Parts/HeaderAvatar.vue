<template>
	<a-dropdown>
		<div class="header-avatar" style="cursor: pointer">
			<a-avatar class="avatar" size="large" shape="circle" :src="avatar" />
			<span class="name">{{ userInfo.realName }}</span>
			<a-icon type="caret-down" />
		</div>
		<a-menu :class="['avatar-menu']" slot="overlay">
			<a-menu-item @click="goToPlatformSelection()">
				<a-icon style="margin-right: 8px" type="cluster" />
				<span>选择业务平台</span>
			</a-menu-item>
			<a-menu-item @click="logout">
				<a-icon style="margin-right: 8px" type="poweroff" />
				<span>退出登录</span>
			</a-menu-item>
		</a-menu>
	</a-dropdown>
</template>

<script>
import router from '@/router'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'HeaderAvatar',

	data() {
		return {
			avatar: require('@/assets/images/me.png'),
		}
	},

	computed: {
		...mapGetters(['userInfo']),
	},

	methods: {
		...mapActions('user', ['Logout', 'selectUserPlatform']),

		goToPlatformSelection() {
			this.selectUserPlatform('').then((res) => {
				router.push({ path: '/user/platform' })
			})
		},

		logout() {
			this.Logout()
		},
	},
}
</script>

<style lang="less">
.header-avatar {
	display: inline-flex;
	.avatar,
	.name {
		align-self: center;
	}
	.avatar {
		margin-right: 8px;
		border: 2px solid #ddd;
	}
	.name {
		color: rgba(0, 0, 0, 0.4);
		font-size: 15px;
		font-weight: 500;
	}

	.anticon-caret-down {
		color: #cccccc;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
}
.avatar-menu {
	width: 150px;
}
</style>
