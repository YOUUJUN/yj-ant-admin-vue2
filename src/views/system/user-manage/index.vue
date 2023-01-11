<template>
	<article class="root">
		<header class="header-wrap">
			<a-form-model layout="inline" @keyup.enter.native="searchQuery">
				<a-form-model-item label="账号">
					<a-input placeholder="请输入账号查询" v-model="queryParam.username"></a-input>
				</a-form-model-item>

				<a-form-model-item label="姓名">
					<a-input placeholder="请输入姓名查询" v-model="queryParam.realname"></a-input>
				</a-form-model-item>

				<a-form-model-item label="手机">
					<a-input placeholder="请输入手机号码查询" v-model="queryParam.phone"></a-input>
				</a-form-model-item>

				<a-form-model-item label="用户状态">
					<a-select style="width: 170px" v-model="queryParam.status" placeholder="选择用户状态">
						<a-select-option :value="undefined">请选择</a-select-option>
						<a-select-option value="true">启用</a-select-option>
						<a-select-option value="false">禁用</a-select-option>
					</a-select>
				</a-form-model-item>

				<a-form-model-item>
					<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
					<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
				</a-form-model-item>
			</a-form-model>

			<a-row :gutter="[8, 14]" style="margin: 14px 0">
				<a-col :span="24">
					<a-button @click="handleAdd" type="primary" icon="plus" v-has="'user:add'">新增用户</a-button>
					<a-button
						v-if="selectedRowKeys.length > 0"
						ghost
						@click="handleDelBunch"
						type="primary"
						icon="delete"
						v-has="'users:delete'"
						style="margin-left: 8px"
					>
						批量删除
					</a-button>
					<a-button
						@click="handleBatchFrozen(true)"
						type="primary"
						v-has="'users:open'"
						v-if="selectedRowKeys.length > 0"
						ghost
						style="margin-left: 8px"
					>
						批量启用
					</a-button>
					<a-button
						@click="handleBatchFrozen(false)"
						type="primary"
						v-has="'users:close'"
						v-if="selectedRowKeys.length > 0"
						ghost
						style="margin-left: 8px"
					>
						批量禁用
					</a-button>
				</a-col>

				<a-col :span="24">
					<div class="ant-alert ant-alert-info">
						已选择&nbsp;
						<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>
						项&nbsp;&nbsp;
						<a style="margin-left: 24px" @click="onClearSelected">清空</a>
					</div>
				</a-col>
			</a-row>
		</header>

		<main>
			<a-table
				ref="table"
				bordered
				size="middle"
				rowKey="id"
				:columns="columns"
				:dataSource="dataSource"
				:rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
				:pagination="ipagination"
				:loading="loading"
				@change="handleTableChange"
			>
				<template slot="status_dictText" slot-scope="text, record">
					<div>
						<span style="margin-right: 6px">{{ record.status == 1 ? '启用' : '禁用' }}</span>
						<a-switch
							:defaultChecked="record.status"
							v-model="record.status"
							@change="(checked) => handleDisableUser(checked, record)"
							v-if="!record.isAdmin"
						/>
					</div>
				</template>

				<span slot="action" slot-scope="text, record">
					<a-button type="link" size="default" @click="handleChoice(record)" v-has="'user:select'">
						角色选择
					</a-button>
					<a-button type="link" size="default" @click="handleView(record)" v-has="'user:detail'">
						查看
					</a-button>
					<a-button type="link" size="default" @click="handleEdit(record)" v-has="'user:edit'">修改</a-button>
					<a-popconfirm
						title="确定删除该用户吗？"
						@confirm="() => handleDel(record)"
						v-if="record.status === false && !record.isAdmin"
					>
						<a-button type="link" size="default" v-has="'user:delete'">删除</a-button>
					</a-popconfirm>
				</span>
			</a-table>
		</main>

		<footer></footer>

		<user-drawer
			ref="userDrawer"
			:visible.sync="visible"
			:ctrlMode="ctrlMode"
			@handleOpenRole="handleOpenRole"
			@handleQuery="searchQuery"
		></user-drawer>

		<choose-role
			ref="rolePanel"
			:visible.sync="visible2"
			:ctrlMode="ctrlModeRole"
			@handleQuery="searchQuery"
		></choose-role>
	</article>
</template>
<script>
import dataListMixin from '@/mixins/data_list_mixin'
import UserDrawer from './modules/UserDrawer.vue'
import ChooseRole from './modules/ChooseRole.vue'

import { deleteUser, editUserStatus, fetchUserRoleRelation } from '@/api/user'

const columns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: 75,
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1
		},
	},
	{
		title: '用户账号',
		align: 'center',
		dataIndex: 'username',
	},
	{
		title: '用户姓名',
		align: 'center',
		dataIndex: 'realName',
	},

	{
		title: '手机号码',
		align: 'center',
		width: 130,
		dataIndex: 'phone',
	},
	{
		title: '创建时间',
		align: 'center',
		dataIndex: 'createTime',
	},
	{
		title: '修改时间',
		align: 'center',
		dataIndex: 'updateTime',
	},
	{
		title: '登录次数',
		align: 'center',
		dataIndex: 'loginNum',
	},

	{
		title: '用户状态',
		align: 'center',
		dataIndex: 'status_dictText',
		scopedSlots: { customRender: 'status_dictText' },
	},
	{
		title: '操作',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' },
		align: 'center',
		width: 300,
	},
]

export default {
	mixins: [dataListMixin],

	components: {
		UserDrawer,
		ChooseRole,
	},

	data() {
		return {
			columns,
			url: {
				list: '/rbac/sys/user/list/',
			},

			visible: false,
			visible2: false,
			ctrlMode: 'add',
			ctrlModeRole: 'add',
		}
	},
	methods: {
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

		//处理启用禁用
		handleDisableUser(checked, record) {
			let status = checked
			editUserStatus({
				ids: [record.id],
				status,
			})
				.then((res) => {
					const { success } = res
					if (success) {
						this.$message.success('修改用户状态成功!')
					} else {
						this.$message.warning('修改用户状态失败!')
					}
				})
				.catch((err) => {
					console.error('err', err)
					this.$message.warning('修改用户状态失败!')
				})
		},

		//打开角色窗体
		handleOpenRole() {
			this.ctrlModeRole = 'add'
			this.visible2 = true
		},

		//处理新增
		handleAdd() {
			this.ctrlMode = 'add'
			this.visible = true
		},

		//处理查看
		handleView(record) {
			this.ctrlMode = 'view'
			this.visible = true
			this.$refs.userDrawer.setData(record)
		},

		//处理编辑
		handleEdit(record) {
			this.ctrlMode = 'modify'
			this.visible = true
			this.$refs.userDrawer.setData(record)
		},

		//处理选择角色
		async handleChoice(record) {
			this.loading = true
			this.ctrlModeRole = 'modify'
			let userRoles = await this.loadUserRoles(record.id)
			this.visible2 = true
			let payload = {
				form: record,
				list: userRoles,
			}
			this.$refs.rolePanel.setData(payload)
			this.loading = false
		},

		//处理删除
		handleDel(record) {
			deleteUser({
				ids: record.id,
			})
				.then((res) => {
					const { success, message } = res
					if (success) {
						this.$message.success('删除成功!')
						this.searchQuery()
					} else {
						this.$message.warning('删除失败!')
					}
				})
				.catch((err) => {
					console.error('err', err)
					this.$message.warning('删除失败!')
				})
		},

		//处理批量删除
		handleDelBunch() {
			let keys = this.selectedRowKeys
			if (keys.length <= 0) {
				this.$message.warning('请选择一条记录！')
				return
			}

			this.$confirm({
				title: '确认删除',
				content: '是否删除选中数据?',
				onOk: () => {
					deleteUser({
						ids: keys.join(','),
					})
						.then((res) => {
							const { success, message } = res
							if (success) {
								this.$message.success('删除成功!')
								this.searchQuery()
							} else {
								this.$message.warning('删除失败!')
							}
						})
						.catch((err) => {
							console.error('err', err)
							this.$message.warning('删除失败!')
						})
				},
				onCancel() {
					console.log('Cancel')
				},
			})
		},

		//处理批量启用禁用
		handleBatchFrozen: function (status) {
			if (this.selectedRowKeys.length <= 0) {
				this.$message.warning('请选择一条记录！')
				return
			}
			if (this.selectionRows.findIndex((item) => item.isAdmin === true) !== -1) {
				this.$message.warning('管理员账号不允许此操作,请重新选择！')
				return
			}
			this.$confirm({
				title: '确认操作',
				content: `是否${status == true ? '启用' : '禁用'}选中账号?`,
				onOk: () => {
					editUserStatus({
						ids: this.selectedRowKeys,
						status,
					})
						.then((res) => {
							const { success } = res
							if (success) {
								this.$message.success('修改用户状态成功!')
								this.searchQuery()
							} else {
								this.$message.warning('修改用户状态失败!')
							}
						})
						.catch((err) => {
							console.error('err', err)
							this.$message.warning('修改用户状态失败!')
						})
				},
			})
		},
	},
}
</script>
<style scoped>
.root {
	background: #fff;
	padding: 2.4rem;
}
</style>
