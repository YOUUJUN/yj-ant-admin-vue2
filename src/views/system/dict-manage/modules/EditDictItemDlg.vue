<template>
	<a-modal
		:width="550"
		:title="modal.title"
		destroyOnClose
		:visible="visible"
		:maskClosable="modal.ifMaskClosable"
		:afterClose="clearData"
		:confirm-loading="modal.confirmLoading"
		@cancel="handleCancel"
		:footer="null"
	>
		<a-form-model
			class="form-wrap"
			ref="detailForm"
			:model="detailForm"
			:rules="detailFormRules"
			:labelCol="labelCol"
			:wrapperCol="wrapperCol"
		>
			<a-form-model-item label="名称" prop="itemText">
				<a-input placeholder="请输入名称" v-model="detailForm.itemText" :disabled="disabled" />
			</a-form-model-item>

			<a-form-model-item label="数据值" prop="itemValue">
				<a-input placeholder="请输入数据值" v-model="detailForm.itemValue" :disabled="disabled" />
			</a-form-model-item>

			<a-form-model-item label="描述" prop="description">
				<a-input placeholder="请输入描述" v-model="detailForm.description" :disabled="disabled" />
			</a-form-model-item>

			<a-form-model-item label="排序值" prop="sortOrder">
				<a-input-number
					placeholder="请输入排序值"
					v-model="detailForm.sortOrder"
					:min="1"
					style="width:150px"
					:disabled="disabled"
				/>
			</a-form-model-item>
		</a-form-model>

		<div class="ctrlBtn-wrap" v-if="ctrlMode === 'add'">
			<a-button type="primary" @click="handleSave" :loading="modal.confirmLoading">保存</a-button>
			<a-button style="margin-left: 18px" @click="handleCancel">返回</a-button>
		</div>

		<div class="ctrlBtn-wrap" v-if="ctrlMode === 'modify'">
			<a-button type="primary" @click="handleModify" :loading="modal.confirmLoading">保存</a-button>
			<a-button style="margin-left: 18px" @click="handleCancel">返回</a-button>
		</div>
	</a-modal>
</template>
<script>
import { addDictItemDetail, editDictItemDetail } from '@/api/system'

export default {
	props: {
		visible: {
			default: false,
			type: Boolean,
		},
		ctrlMode: {
			default: 'add',
			type: String,
		},
	},

	data() {
		return {
			modal: {
				title: '新增',
				confirmLoading: false,
				ifMaskClosable: true,
			},

			disabled: false,

			detailForm: {},
			detailFormRules: {
				itemText: { required: true, message: '请输入字典名称', trigger: 'blur' },
				itemValue: [
					{ required: true, message: '请输入字典编码', trigger: 'blur' },
					,
					{ validator: this.validateItemValue },
				],
			},
			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		}
	},

	watch: {
		ctrlMode: {
			immediate: true,
			handler(newValue) {
				if (newValue === 'add') {
					this.disabled = false
					this.modal.title = '新增'
				} else if (newValue === 'view') {
					this.disabled = true
					this.modal.title = '查看'
				} else if (newValue === 'modify') {
					this.disabled = false
					this.modal.title = '修改'
				}
			},
		},
	},

	methods: {
		setData(record) {
			console.log('record--', record)
			this.$set(this, 'detailForm', Object.assign({}, record))
		},

		clearData() {
			this.detailForm = this.$options.data().detailForm
		},

		handleSave() {
			this.$refs.detailForm
				.validate()
				.then((res) => {
					let payload = Object.assign({}, this.detailForm)
					console.log('payload', payload)
					addDictItemDetail(payload)
						.then((res) => {
							if (res.success) {
								this.$message.success('新增字典项成功!')
								this.$emit('handleQuery')
								this.handleCancel()
							} else {
								this.$message.warning(res.message)
							}
						})
						.catch((err) => {
							this.$message.warning('新增字典项失败!')
							console.error('err', err)
						})
				})
				.catch((err) => {
					console.error('err', err)
				})
		},

		handleModify() {
			this.$refs.detailForm
				.validate()
				.then((res) => {
					let payload = Object.assign({}, this.detailForm)
					console.log('payload', payload)
					editDictItemDetail(payload)
						.then((res) => {
							if (res.success) {
								this.$message.success('修改字典项成功!')
								this.$emit('handleQuery')
								this.handleCancel()
							} else {
								this.$message.warning(res.message)
							}
						})
						.catch((err) => {
							this.$message.warning('修改字典项失败!')
							console.error('err', err)
						})
				})
				.catch((err) => {
					console.error('err', err)
				})
		},

		handleCancel() {
			this.$emit('update:visible', false)
		},

		//验证数据值是否有效
		validateItemValue(rule, value, callback) {
			if (value) {
				let reg = new RegExp("[`_~!@#$^&*()=|{}'.<>《》/?！￥（）—【】‘；：”“。，、？]")
				if (reg.test(value)) {
					callback('数据值不能包含特殊字符！')
				} else {
					callback()
				}
			} else {
				callback()
			}
		},
	},
}
</script>
<style scoped>
.ctrlBtn-wrap {
	display: flex;
	justify-content: flex-end;
}
</style>
