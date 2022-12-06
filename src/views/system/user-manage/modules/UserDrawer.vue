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
					<a-form-model-item label="账号" prop="username">
						<a-input
							placeholder="请输入用户账号"
							size="large"
							v-model="detailForm.username"
							:disabled="disabled"
						/>
					</a-form-model-item>

					<a-form-model-item label="密码" prop="password">
						<a-input-search
							placeholder="请输入密码"
							size="large"
							v-model="detailForm.password"
							:disabled="disabled"
							@search="clearPassword"
						>
							<a-button slot="enterButton" :disabled="disabled">重置</a-button>
						</a-input-search>
					</a-form-model-item>

					<a-form-model-item label="姓名" prop="realName">
						<a-input
							placeholder="请输入姓名"
							size="large"
							v-model="detailForm.realName"
							:disabled="disabled"
						/>
					</a-form-model-item>

					<a-form-model-item label="手机">
						<a-input
							placeholder="请输入手机"
							size="large"
							v-model="detailForm.phone"
							:disabled="disabled"
						/>
					</a-form-model-item>

					<a-form-model-item label="用户状态">
						<a-switch v-model="detailForm.status" :disabled="disabled" />
					</a-form-model-item>

					<a-form-model-item label="是否管理员">
						<a-switch v-model="detailForm.isAdmin" :disabled="disabled" />
					</a-form-model-item>

					<a-form-model-item label="角色">
						<a-button @click="handleOpenRole" v-if="!disabled">选择角色</a-button>
					</a-form-model-item>
				</a-form-model>
			</a-spin>

			<section class="roles-wrap">
				<a-tag v-for="item in rolesList" color="green">{{ item.name }}</a-tag>
			</section>

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
import { addUser, editUser, fetchUserRoleRelation } from '@/api/user'
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

			detailForm: {
				password: 666666,
				status: true,
				isAdmin: false,
			},
			detailFormRules: {
				username: { required: true, message: '请输入用户账号', trigger: 'blur' },
				password: { required: true, message: '请输入用户密码', trigger: 'blur' },
				realName: { required: true, message: '请输入用户姓名', trigger: 'blur' },
			},

			rolesList: [],
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
		clearData() {
			this.detailForm = this.$options.data().detailForm
			this.rolesList = []
		},

		async setData(record) {
			this.loading = true
			this.detailForm = Object.assign({}, record)
			this.rolesList = await this.loadUserRoles(record.id)
			this.loading = false
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
					let roles = this.rolesList
						.map((item) => {
							return item.id
						})
						.join(',')
					let payload = Object.assign({}, this.detailForm, {
						selectedroles: roles,
					})
					console.log('payload', payload)
					addUser(payload)
						.then((res) => {
							if (res.success) {
								this.$message.success('新增用户成功!')
								this.$emit('handleQuery')
								this.handleCancel()
							} else {
								this.$message.warning(res.message)
							}
						})
						.catch((err) => {
							this.$message.warning('新增用户失败!')
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
					let roles = this.rolesList
						.map((item) => {
							return item.id
						})
						.join(',')
					let payload = Object.assign({}, this.detailForm, {
						selectedroles: roles,
					})
					editUser(payload)
						.then((res) => {
							if (res.success) {
								this.$message.success('编辑用户成功!')
								this.$emit('handleQuery')
								this.handleCancel()
							} else {
								this.$message.warning(res.message)
							}
						})
						.catch((err) => {
							this.$message.warning('编辑用户失败!')
							console.error('err', err)
						})
				})
				.catch((err) => {
					console.error('err', err)
				})
		},

		//获取角色列表
		loadUserRoles(userid) {
			return new Promise((resolve, reject) => {
				fetchUserRoleRelation({ userId: userid })
					.then((res) => {
						if (res.success) {
							let selectedRole = res?.result.map((item) => {
								return {
									id: item.roleId,
									name: item.roleName,
								}
							})
							resolve(selectedRole)
						} else {
							resolve([])
						}
					})
					.catch((err) => {
						reject(err)
					})
			})
		},

		//打开角色
		handleOpenRole() {
			this.$bus.$once('handleSendRoles', (roles) => {
				this.rolesList = roles
				console.log('rolesList', this.rolesList)
			})

			this.$emit('handleOpenRole')

			this.$bus.$emit('handleReceiveRoles', {
				list: this.rolesList,
				form: this.detailForm,
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

/*---编辑状态下隐藏placeholder---*/
.description-wrap input[disabled]::placeholder,
.description-wrap textarea[disabled]::placeholder {
	font-size: 0;
}

::v-deep .description-wrap .ant-select-disabled .ant-select-selection__placeholder {
	visibility: hidden;
}
</style>
