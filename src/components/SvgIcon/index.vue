<template>
	<svg :class="svgClass" aria-hidden="true" v-on="$listeners">
		<use :xlink:href="iconName"></use>
	</svg>
</template>
<script>
/**
 * 自定义svg图标组件
 * 使用 ：
 *
 *	<svg-icon :iconClass="svgName"></svg-icon>
 *
 */
export default {
	name: 'SvgIcon',
	props: {
		iconClass: {
			type: String,
			required: true,
		},
		className: {
			type: String,
			default: '',
		},
	},
	data() {
		return {}
	},

	computed: {
		iconName() {
			return `#icon-${this.iconClass}`
		},
		svgClass() {
			if (this.className) {
				return `svg-icon ${this.className}`
			} else {
				return `svg-icon`
			}
		},
	},
}
</script>
<style scoped>
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
</style>
