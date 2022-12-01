<template>
	<article class="root">
		<header>
			<a-row :gutter="[8, 16]">
				<a-col :span="24">
					<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
					<a-button
						@click="handleBatchDel"
						v-if="selectedRowKeys.length > 0"
						ghost
						type="primary"
						icon="delete"
						style="margin-left: 14px"
					>
						批量删除
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
				:columns="columns"
				rowKey="id"
				size="middle"
				:pagination="false"
				:dataSource="dataSource"
				:loading="loading"
				:expandedRowKeys="expandedRowKeys"
				:rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
				@expandedRowsChange="handleExpandedRowsChange"
			>
				<template slot="action" slot-scope="text, record">
					<a-button type="link" size="default" @click="handleEdit(record)">编辑</a-button>
					<a-button type="link" size="default" @click="handleView(record)">查看</a-button>
					<a-button v-if="record.menuType !== '2'" type="link" size="default" @click="handleAddSub(record)">
						添加下级
					</a-button>
					<a-popconfirm title="确定删除吗?" @confirm="() => handleDel(record)">
						<a-button type="link" size="default">删除</a-button>
					</a-popconfirm>
				</template>
			</a-table>
		</main>

		<menu-operate-model ref="operateModel" @doSearch="searchQuery"></menu-operate-model>
	</article>
</template>
<script>
import dataListMixin from '@/mixins/dataListMixin'
import { getAction } from '@/api/manage'
import { editPermission } from '@/api/system'

import MenuOperateModel from './modules/MenuOperateModel'

const columns = [
	{
		title: '菜单名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '菜单类型',
		dataIndex: 'menuType',
		key: 'menuType',
		customRender: function (text) {
			if (text == 0) {
				return '菜单'
			} else if (text == 1) {
				return '菜单'
			} else if (text == 2) {
				return '按钮/权限'
			} else {
				return text
			}
		},
	},
	/*{
      title: '权限编码',
      dataIndex: 'perms',
      key: 'permissionCode',
    },*/ {
		title: 'icon',
		dataIndex: 'icon',
		key: 'icon',
	},
	{
		title: '组件',
		dataIndex: 'component',
		key: 'component',
		scopedSlots: { customRender: 'component' },
	},
	{
		title: '路径',
		dataIndex: 'url',
		key: 'url',
		scopedSlots: { customRender: 'url' },
	},
	{
		title: '排序',
		dataIndex: 'sortNo',
		key: 'sortNo',
	},
	{
		title: '操作',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' },
		align: 'center',
		width: 310,
	},
]

export default {
	mixins: [dataListMixin],

	components: {
		MenuOperateModel,
	},

	data() {
		return {
			columns,
			loading: false,
			expandedRowKeys: [], // 展开的行
			url: {
				list: '/sys/permission/list',
				delete: '/sys/permission/delete',
				deleteBatch: '/sys/permission/deleteBatch',
			},
		}
	},

	methods: {
		//获取数据
		loadData(page) {
			return new Promise((resolve, reject) => {
				if (!this.url.list) {
					console.error('请设置url.list属性!')
					return
				}
				//加载数据 若传入参数1则加载第一页的内容
				if (page === 1) {
					this.ipagination.current = 1
				}

				var params = this.getQueryParams() //查询条件
				this.loading = true

				getAction(this.url.list, params)
					.then((res) => {
						if (res?.result) {
							this.dataSource = res.result
						}
						resolve(res?.result)
					})
					.catch((err) => {
						console.error('loadData err', err)
						reject(err)
					})
					.finally(() => {
						this.loading = false
					})
			})
		},

		//处理新增菜单
		handleAdd() {
			const operateModel = this.$refs['operateModel']
			const screenWidth = document.body.clientWidth
			operateModel.visible = true
			operateModel.title = '新增'
			operateModel.disableSubmit = false
			operateModel.drawerWidth = screenWidth < 500 ? screenWidth : 700
			operateModel.initData({ menuType: '0' })
		},

		//处理添加下级菜单
		handleAddSub(record) {
			console.log('record', record)
			const operateModel = this.$refs['operateModel']
			const screenWidth = document.body.clientWidth
			operateModel.visible = true
			operateModel.title = '添加子菜单'
			operateModel.disableSubmit = false
			operateModel.drawerWidth = screenWidth < 500 ? screenWidth : 700
			operateModel.initData({ menuType: '1', parentId: record.id })
		},

		//处理编辑菜单
		handleEdit(record) {
			const operateModel = this.$refs['operateModel']
			const screenWidth = document.body.clientWidth
			operateModel.visible = true
			operateModel.title = '编辑'
			operateModel.disableSubmit = false
			operateModel.drawerWidth = screenWidth < 500 ? screenWidth : 700
			operateModel.initData(record)
		},

		//处理查看菜单
		handleView(record) {
			const operateModel = this.$refs['operateModel']
			const screenWidth = document.body.clientWidth
			operateModel.visible = true
			operateModel.title = '查看'
			operateModel.disableSubmit = true
			operateModel.drawerWidth = screenWidth < 500 ? screenWidth : 700
			operateModel.initData(record)
		},

		//处理删除按钮
		handleDel(record) {
			const { id } = record
			editPermission({
				id,
				delFlag: 1,
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
					this.$message.warning('删除失败!')
				})
		},

		//处理批量删除按钮
		handleBatchDel() {
			if (this.selectedRowKeys.length <= 0) {
				this.$message.warning('请选择一条记录！')
				return
			}

			this.$confirm({
				title: '确认删除',
				content: '是否删除选中数据?',
				onOk: () => {
					
				},	
			})
		},

		//监听行展开
		handleExpandedRowsChange(expandedRows) {
			this.expandedRowKeys = expandedRows
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
