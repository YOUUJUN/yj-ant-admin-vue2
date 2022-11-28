<template>
	<article class="root">
		<header>
			<a-row :gutter="[8, 8]">
				<a-col :span="24">
					<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
				size="middle"
				:pagination="false"
				:dataSource="dataSource"
				:loading="loading"
				:expandedRowKeys="expandedRowKeys"
				:rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
				@expandedRowsChange="handleExpandedRowsChange"
			></a-table>
		</main>
	</article>
</template>
<script>
import { getPermissionList } from '@/api/api'
import dataListMixin from '@/mixins/dataListMixin'

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
		width: 150,
	},
]

export default {
	mixins: [dataListMixin],

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
		//处理新增菜单
		handleAdd() {},

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
	padding: 2rem 1rem;
}
</style>
