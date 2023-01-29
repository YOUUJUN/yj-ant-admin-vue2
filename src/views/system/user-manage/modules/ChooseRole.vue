<template>
	<a-drawer
		:title="modal.title"
		:maskClosable="true"
		:width="550"
		placement="right"
		:closable="true"
		:zIndex="999"
		@close="handleCancel"
		:visible="visible"
		style="height: 100%; overflow: auto; padding-bottom: 53px"
	>
		<article class="root">
			<a-form-model class="form-wrap" :model="detailForm">
				<a-form-model-item label="账号">
					<a-input size="large" v-model="detailForm.username" disabled />
				</a-form-model-item>

				<a-form-model-item label="搜索角色">
					<a-input
						placeholder="请输入角色名称或角色说明"
						size="large"
						v-model="detailForm.params"
						@change="handleSearch"
					/>
				</a-form-model-item>
			</a-form-model>

			<a-table
				class="table"
				:columns="columns"
				bordered
				rowKey="id"
				:data-source="dataSource"
				:row-selection="rowSelection"
				:pagination="ipagination"
				@change="handleTableChange"
				:loading="loading"
			></a-table>

			<div class="drawer-bootom-button" v-if="ctrlMode === 'add'">
				<a-button @click="handleSubmit" type="primary">提交</a-button>

				<a-button style="margin: 0.8rem" @click="handleCancel">取消</a-button>
			</div>

			<div class="drawer-bootom-button" v-if="ctrlMode === 'modify'">
				<a-button @click="handleEdit" type="primary">提交</a-button>

				<a-button style="margin: 0.8rem" @click="handleCancel">取消</a-button>
			</div>
		</article>
	</a-drawer>
</template>

<script>
import { getAction } from '@/api/manage'
import { editUserRole } from '@/api/user'
import dataListMixin from '@/mixins/data_list_mixin'

const columns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: 90,
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1
		},
	},

	{
		title: '角色名称',
		align: 'center',
		dataIndex: 'roleName',
	},

	{
		title: '角色说明',
		align: 'center',
		dataIndex: 'description',
	},
]

export default {
	mixins: [dataListMixin],

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
				title: '选择角色',
			},

			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},

			detailForm: {},

			url: {
				list: '/rbac/sys/role/list',
			},
			columns,
			loading: false,
			/* 分页参数 */
			ipagination: {
				current: 1,
				pageSize: 1000,
				showTotal: (total, range) => {
					return range[0] + '-' + range[1] + ' 共' + total + '条'
				},
				showQuickJumper: false,
				showSizeChanger: false,
				total: 0,
			},

			//数据缓存
			dataSource_cache: [],
		}
	},

	computed: {
		rowSelection() {
			const { selectedRowKeys } = this
			return {
				selectedRowKeys,
				onChange: this.onSelectChange,
				hideDefaultSelections: true,
				onSelection: this.onSelection,
			}
		},
	},

	watch: {
		//关闭时清除数据
		visible: {
			handler(newValue) {
				if (newValue === false) {
					this.clearData()
				} else {
				}
			},
		},

		selectedRowKeys: {
			// immediate : true,
			handler(newValue) {
				this.handleSelectRole()
			},
		},
	},

	created() {
		this.bindListener()
	},

	methods: {
		clearData() {
			this.detailForm = this.$options.data().detailForm
			this.selectedRowKeys = []
			this.dataSource = this.dataSource_cache
		},

		setData(data) {
			this.detailForm = Object.assign({}, data.form)
			this.selectedRowKeys = data.list.map((item) => item.id)
		},

		bindListener() {
			this.$bus.$on('handleReceiveRoles', (data) => {
				this.detailForm = Object.assign({}, data.form)
				this.selectedRowKeys = data.list.map((item) => {
					return item.id
				})

				console.log('selectedRowKeys', this.selectedRowKeys)
			})
		},

		handleCancel() {
			this.$emit('update:visible', false)
		},

		handleSelectRole() {
			console.log('selectedRowKeys', this.selectedRowKeys)
		},

		//处理提交
		handleSubmit() {
			let dataSource = this.dataSource
			let payload = this.selectedRowKeys.map((item) => {
				let rowData = dataSource.find((row) => {
					return row.id === item
				})
				return {
					id: rowData.id,
					name: rowData.roleName,
				}
			})
			this.$bus.$emit('handleSendRoles', payload)
			this.handleCancel()
		},

		//处理直接编辑角色
		handleEdit() {
			let roles = this.selectedRowKeys.join(',')
			let payload = Object.assign({}, this.detailForm, {
				selectedRoles: roles,
			})
			editUserRole(payload)
				.then((res) => {
					this.$message.success('修改用户角色成功!')
					this.$emit('handleQuery')
					this.handleCancel()
				})
				.catch((err) => {
					this.$message.warning('修改用户角色失败!')
					console.error('err', err)
				})
		},

		test() {
			this.loadData()
		},

		//处理搜索
		handleSearch(event) {
			let dataSource_cache = this.dataSource_cache
			let searchParams = this.detailForm.params
			console.log('searchParams', searchParams)
			if (!searchParams) {
				this.dataSource = dataSource_cache
				return
			}

			let searchResult = []

			let result = dataSource_cache.reduce((previousValue, element, index) => {
				let roleName = element.roleName
				let description = element.description
				let id = element.id
				if (
					roleName &&
					roleName.includes(searchParams) &&
					previousValue.findIndex((item) => item.id === id) === -1
				) {
					previousValue.push(element)
				}

				if (
					description &&
					description.includes(searchParams) &&
					previousValue.findIndex((item) => item.id === id) === -1
				) {
					previousValue.push(element)
				}

				return previousValue
			}, [])

			console.log('result', result)

			this.dataSource = result
		},

		loadData(arg) {
			//加载数据 若传入参数1则加载第一页的内容
			if (arg === 1) {
				this.ipagination.current = 1
			}
			var params = this.getQueryParams() //查询条件
			this.loading = true
			getAction(this.url.list, params).then((res) => {
				if (res.success) {
					let result = res.result.records || res.result
					this.dataSource = result
					this.dataSource_cache = result
					if (res.result) {
						this.ipagination.total = res.result.total
					}
				}
				if (res.code === 510) {
					this.$message.warning(res.message)
				}
				this.loading = false
			})
		},
	},
}
</script>

<style scoped>
.root {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-bottom: 80px;
}

.form-wrap {
	width: 420px;
}

::v-deep .ant-form-item {
	margin-bottom: 5px;
}

.table {
	margin-top: 20px;
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
