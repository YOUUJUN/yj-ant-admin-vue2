<template>
	<article class="exception-page">
		<figure class="img">
			<img :src="Config[type].img" />
		</figure>

		<main class="content">
			<h1>{{ Config[type].title }}</h1>
			<p class="desc">{{ Config[type].desc }}</p>
			<div class="action">
				<a-button type="primary" @click="backHome">返回首页</a-button>
			</div>
		</main>
	</article>
</template>
<script>
import Config from './typeConfig'

export default {
	props: ['type', 'homeRoute'],
	data() {
		return {
			Config,
		}
	},
	methods: {
		backHome() {
			if (this.homeRoute) {
				this.$router.push(this.homeRoute)
			}
			this.$emit('backHome', this.type)
		},
	},
}
</script>

<style lang="less" scoped>
.exception-page {
	border-radius: 4px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #fff;
	.img {
		padding-right: 52px;
		zoom: 1;
		img {
			max-width: 430px;
		}
	}
	.content {
		h1 {
			color: #434e59;
			font-size: 72px;
			font-weight: 600;
			line-height: 72px;
			margin-bottom: 24px;
		}
		.desc {
			color: rgba(0, 0, 0, 0.75);
			font-size: 20px;
			line-height: 28px;
			margin-bottom: 16px;
		}
	}
}
</style>
