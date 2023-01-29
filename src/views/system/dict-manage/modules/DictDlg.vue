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
			<a-form-model-item label="字典名称" prop="dictName">
				<a-input placeholder="请输入字典名称" v-model="detailForm.dictName" :disabled="disabled" />
			</a-form-model-item>

			<a-form-model-item label="字典编码" prop="dictCode">
				<a-input placeholder="请输入字典编码" v-model="detailForm.dictCode" :disabled="disabled" />
			</a-form-model-item>

			<a-form-model-item label="描述" prop="description">
				<a-input placeholder="请输入描述" v-model="detailForm.description" :disabled="disabled" />
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
import { addDictItem, editDictItem, duplicateCheck } from '@/api/system'

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
				dictName: { required: true, message: '请输入字典名称', trigger: 'blur' },
				dictCode: [
					{ required: true, message: '请输入字典编码', trigger: 'blur' },
					{ validator: this.validateDictCode },
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
					addDictItem(payload)
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
					editDictItem(payload)
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

		//校验字典编码是否重复
		validateDictCode(rule, value, callback) {
			// 重复校验
			let params = {
				tableName: 'sys_dict',
				fieldName: 'dict_code',
				fieldVal: value,
				dataId: this.detailForm.id,
			}

			duplicateCheck(params).then((res) => {
				if (res.success) {
					callback()
				} else {
					callback(res.message)
				}
			})
		},
	},
}
</script>
<style scoped>
.ctrlBtn-wrap {
	display: flex;
	justify-content: flex-end;
}

::v-deep .ant-form-item-label {
	text-align: left;
	padding-left: 1.5rem;
}
</style>
