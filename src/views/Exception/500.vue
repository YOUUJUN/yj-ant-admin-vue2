<template>
	<exception-page :home-route="indexPath" :style="`min-height: 100vh`" type="505" />
</template>

<script>
import ExceptionPage from '@/components/Exception/ExceptionPage.vue'
export default {
	name: 'Exp505',
	components: { ExceptionPage },
	data() {
		this.indexPath = window._CONFIG['indexURL']
		return {}
	},
}
</script>

<style scoped lang="less"></style>
