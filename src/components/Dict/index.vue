<template>
	<a-radio-group v-if="tagType == 'radio'" @change="handleInput" :value="getValueSting" :disabled="disabled">
		<a-radio v-for="(item, key) in dictOptions" :key="key" :value="item.value">{{ item.text }}</a-radio>
	</a-radio-group>

	<a-radio-group
		v-else-if="tagType == 'radioButton'"
		buttonStyle="solid"
		@change="handleInput"
		:value="getValueSting"
		:disabled="disabled"
	>
		<a-radio-button v-for="(item, key) in dictOptions" :key="key" :value="item.value">
			{{ item.text }}
		</a-radio-button>
	</a-radio-group>

	<a-select
		v-else-if="tagType == 'select'"
		:getPopupContainer="getPopupContainer"
		:placeholder="placeholder"
		:disabled="disabled"
		:value="getValueSting"
		@change="handleInput"
		@select="handleSelect"
	>
		<a-select-option v-if="blank" :value="undefined">请选择</a-select-option>
		<a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.value">
			<span style="display: inline-block; width: 100%" :title="item.text || item.label">
				{{ item.text || item.label }}
			</span>
		</a-select-option>
	</a-select>
</template>

<script>
/**
 * 字典组件
 *
 * 	使用：
 * 		从字典表获取数据,dictCode格式说明: 字典code
 * 		<j-dict-select-tag  v-model="queryParam.sex" placeholder="请输入用户性别" dictCode="sex"/>
 *
 * 		v-decorator用法：
 * 		<j-dict-select-tag  v-decorator="['sex', {}]" :triggerChange="true" placeholder="请输入用户性别" dictCode="sex"/>
 *
 * 		从数据库表获取字典数据，dictCode格式说明: 表名,文本字段,取值字段
 * 		<j-dict-select-tag v-model="queryParam.username" placeholder="请选择用户名称" dictCode="sys_user,realname,id"/>
 *
 *
 */

import { ajaxGetDictItems, getDictItemsFromCache } from '@/api/system'

export default {
	name: 'DictSelectTag',
	props: {
		dictCode: String,
		placeholder: String,
		triggerChange: Boolean,
		disabled: Boolean,
		value: [String, Number],
		type: String,
		getPopupContainer: {
			type: Function,
			default: (node) => node.parentNode,
		},
		blank: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			dictOptions: [],
			tagType: '',
		}
	},
	watch: {
		dictCode: {
			immediate: true,
			handler() {
				this.initDictData()
			},
		},
	},
	created() {
		if (!this.type || this.type === 'list') {
			this.tagType = 'select'
		} else {
			this.tagType = this.type
		}
	},
	computed: {
		getValueSting() {
			this.$emit('change', this.value)
			// update-begin author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
			// 当有null或“” placeholder不显示
			return this.value != null ? this.value.toString() : undefined
			// update-end author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
		},
	},
	methods: {
		initDictData() {
			//优先从缓存中读取字典配置
			if (getDictItemsFromCache(this.dictCode)) {
				this.dictOptions = getDictItemsFromCache(this.dictCode)
				return
			}

			//根据字典Code, 初始化字典数组
			ajaxGetDictItems(this.dictCode, null).then((res) => {
				if (res.success) {
					//                console.log(res.result);
					this.dictOptions = res.result
				}
			})
		},
		handleInput(e) {
			let val
			if (this.tagType == 'radio') {
				val = e.target.value
			} else {
				val = e
			}
			console.log(val)
			if (this.triggerChange) {
				this.$emit('change', val)
				this.$emit('input', val)
			} else {
				this.$emit('input', val)
			}
		},
		setCurrentDictOptions(dictOptions) {
			this.dictOptions = dictOptions
		},
		getCurrentDictOptions() {
			return this.dictOptions
		},

		handleSelect(value, option) {
			this.$emit('select', value)
		},
	},
}
</script>

<style scoped></style>
