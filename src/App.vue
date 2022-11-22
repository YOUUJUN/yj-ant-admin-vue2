<template>
	<a-config-provider :locale="locale">
		<div id="app">
			<router-view />
		</div>
	</a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
	name: 'App',
	data() {
		return {
			locale: zhCN,
		}
	},
}
</script>

<style>
@import url('~@/styles/index.css');
html,
body {
	height: 100%;
	margin: 0;
	padding: 0;
	font-size: 62.5%;
	font-family: Poppins, sans-serif;
	box-sizing: border-box;
}

#app {
	height: 100%;
}
</style>
