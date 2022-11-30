<template>
	<exception-page :home-route="indexPath" :style="`min-height: 100vh`" type="404" />
</template>

<script>
import ExceptionPage from '@/components/Exception/ExceptionPage.vue'
export default {
	name: 'Exp404',
	components: { ExceptionPage },
	data() {
		this.indexPath = window._CONFIG['indexURL']
		return {}
	},
}
</script>

<style scoped lang="less"></style>
