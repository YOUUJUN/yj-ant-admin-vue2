<template>
	<a-drawer
		:title="modal.title"
		:maskClosable="true"
		:width="550"
		placement="right"
		:closable="true"
		:zIndex="998"
		@close="handleCancel"
		:visible="visible"
		style="height: 100%; overflow: auto; padding-bottom: 53px"
	>
		<article class="root">
			<a-spin :spinning="loading">
				<a-form-model class="form-wrap" ref="detailForm" :model="detailForm" :rules="detailFormRules">
					<a-form-model-item label="角色名称" prop="roleName">
						<a-input
							placeholder="请输入唯一角色名称"
							size="large"
							v-model="detailForm.roleName"
							:disabled="disabled"
						/>
					</a-form-model-item>

					<a-form-model-item label="角色说明" prop="description">
						<a-textarea
							placeholder="输入角色说明，便于记忆哦"
							size="large"
							:rows="4"
							v-model="detailForm.description"
							:disabled="disabled"
							:maxLength="120"
							allowClear
						/>
					</a-form-model-item>

					<a-form-model-item label="角色用户" v-if="ctrlMode === 'view'">
						<section class="users-wrap">
							<span v-for="item in usersList" class="ant-tag ant-tag-green">
								{{ item.username }}
							</span>
						</section>
					</a-form-model-item>
				</a-form-model>
			</a-spin>

			<div class="drawer-bootom-button" v-if="ctrlMode === 'add'">
				<a-button @click="handleSubmit" type="primary">提交</a-button>

				<a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
					<a-button style="margin: 0.8rem">取消</a-button>
				</a-popconfirm>
			</div>
		</article>

		<div class="drawer-bootom-button" v-if="ctrlMode === 'modify'">
			<a-button @click="handleEdit" type="primary">提交</a-button>

			<a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
				<a-button style="margin: 0.8rem">取消</a-button>
			</a-popconfirm>
		</div>
	</a-drawer>
</template>

<script>
import { addRole, editRole } from '@/api/user'
import { getAction, postAction, putAction } from '@/api/manage'
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},

		ctrlMode: {
			type: String,
			default: 'add',
		},
	},

	data() {
		return {
			modal: {
				title: '新增',
			},

			loading: false,

			disabled: false,

			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},

			detailForm: {},
			detailFormRules: {
				roleName: { required: true, message: '请输入唯一角色名称', trigger: 'blur' },
			},

			//角色用户列表
			usersList: [],
		}
	},

	watch: {
		//关闭时清除数据
		visible: {
			handler(newValue) {
				if (newValue === false) {
					this.clearData()
				}
			},
		},

		ctrlMode: {
			immediate: true,
			handler(newValue) {
				if (newValue === 'add') {
					this.disabled = false
					this.modal.title = '添加角色'
				} else if (newValue === 'view') {
					this.disabled = true
					this.modal.title = '查看角色'
				} else if (newValue === 'modify') {
					this.disabled = false
					this.modal.title = '修改角色'
				}
			},
		},
	},

	methods: {
		clearData() {
			this.detailForm = this.$options.data().detailForm
		},

		setData(record) {
			console.log('ctrlMode', this.ctrlMode)
			if (this.ctrlMode === 'modify') {
				this.detailForm = Object.assign({}, record)
			} else if (this.ctrlMode === 'view') {
				this.detailForm = Object.assign({}, record.form)
				this.usersList = record.list
			}
		},

		//重置密码
		clearPassword() {
			this.$set(this.detailForm, 'password', this.$options.data().detailForm.password)
		},

		handleCancel() {
			this.$emit('update:visible', false)
		},

		//处理提交
		handleSubmit() {
			this.$refs.detailForm
				.validate()
				.then((res) => {
					let payload = Object.assign({}, this.detailForm)
					addRole(payload)
						.then((res) => {
							const { success, message } = res
							if (success) {
								this.$message.success('新增角色成功!')
								this.$emit('handleQuery')
								this.handleCancel()
							} else {
								this.$message.warning(message)
							}
						})
						.catch((err) => {
							this.$message.warning('新增角色失败!')
							console.error('err', err)
						})
				})
				.catch((err) => {
					console.error('err', err)
				})
		},

		//处理编辑
		handleEdit() {
			this.$refs.detailForm
				.validate()
				.then((res) => {
					let payload = Object.assign(
						{},
						{
							id: this.detailForm.id,
							roleName: this.detailForm.roleName,
							description: this.detailForm.description,
						},
					)
					editRole(payload)
						.then((res) => {
                            const { success, message } = res
							if (success) {
								this.$message.success('编辑角色成功!')
								this.$emit('handleQuery')
								this.handleCancel()
							} else {
								this.$message.warning(message)
							}
						})
						.catch((err) => {
							this.$message.warning('编辑角色失败!')
							console.error('err', err)
						})
				})
				.catch((err) => {
					console.error('err', err)
				})
		},
	},
}
</script>

<style scoped>
.root {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-bottom: 80px;
}

.form-wrap,
.roles-wrap {
	width: 420px;
}

::v-deep .ant-form-item {
	margin-bottom: 5px;
}

::v-deep .roles-wrap .ant-tag {
	margin: 8px;
}

.drawer-bootom-button {
	position: absolute;
	bottom: -8px;
	width: 100%;
	border-top: 1px solid #e8e8e8;
	padding: 10px 16px;
	text-align: right;
	left: 0;
	background: #fff;
	border-radius: 0 0 2px 2px;
}
</style>
