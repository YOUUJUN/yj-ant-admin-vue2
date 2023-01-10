<template>
	<div class="root">
		<a-button
			v-for="(item, index) of accessiblePlatforms"
			style="margin: 1.5rem"
			@click="enterPlatform(item.id)"
			:key="index"
		>
			进入{{ item.name }}
		</a-button>
	</div>
</template>
<script>
import { chooseUserPlatform } from '@/api/user'
import { getToken } from '@/utils/ls_operation'

import { mapGetters, mapActions } from 'vuex'

export default {
	data() {
		return {}
	},

	computed: {
		...mapGetters(['accessiblePlatforms']),
	},

	created() {
		console.log('accessiblePlatforms', this.accessiblePlatforms)
	},

	methods: {
		...mapActions('user', ['setToken']),

		enterPlatform(platformId) {
			console.log('getToken', getToken())
			const token = getToken()
			chooseUserPlatform({
				platformType: platformId,
				token,
			})
				.then((res) => {
					console.log('res', res)
					const { message } = res
					this.setToken(message).then(res => {
						this.$router.push({path : '/index', replace: true})
					})
				})
				.catch((err) => {
					console.error('err', err)
				})
		},
	},
}
</script>
<style scoped></style>
