<template>
	<article class="root">
		<header>
			<a-form-model layout="inline" @keyup.enter.native="searchQuery">
				<a-form-model-item label="字典名称">
					<a-input placeholder="请输入字典名称" v-model="queryParam.dictName"></a-input>
				</a-form-model-item>

				<a-form-model-item label="字典编号">
					<a-input placeholder="请输入字典编号" v-model="queryParam.dictCode"></a-input>
				</a-form-model-item>

				<a-form-model-item>
					<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
					<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
				</a-form-model-item>
			</a-form-model>

			<a-row :gutter="[8, 14]" style="margin: 14px 0">
				<a-col :span="24">
					<a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
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
				:pagination="ipagination"
				:loading="loading"
				@change="handleTableChange"
			>
				<span slot="action" slot-scope="text, record">
					<a-button type="link" icon="edit" size="default" @click="handleEdit(record)">编辑</a-button>
					<a-button type="link" icon="setting" size="default" @click="handleEditDictItem(record)">
						字典配置
					</a-button>
					<a-popconfirm title="确定删除该字典项吗？" @confirm="() => handleDel(record)">
						<a-button type="link" size="default">删除</a-button>
					</a-popconfirm>
				</span>
			</a-table>
		</main>

		<footer></footer>

		<dict-dlg ref="dictDlg" :visible.sync="visible" :ctrlMode="ctrlMode" @handleQuery="searchQuery"></dict-dlg>
		<dict-item-drawer
			ref="dictItemDrawer"
			:visible.sync="visible2"
			@handleQuery="searchQuery"
			@openDictEditorDlg="openDictEditorDlg"
		></dict-item-drawer>
		<edit-dict-item-dlg
			ref="dictEditorDlg"
			:visible.sync="visible3"
			:ctrlMode="ctrlMode3"
			@handleQuery="doDrawerSearch"
		></edit-dict-item-dlg>
	</article>
</template>
<script>
import dataListMixin from '@/mixins/data_list_mixin'
import DictDlg from './modules/DictDlg.vue'
import DictItemDrawer from './modules/DictItemDrawer.vue'
import EditDictItemDlg from './modules/EditDictItemDlg.vue'
import { deleteDictItem } from '@/api/system'

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
		title: '字典名称',
		align: 'left',
		dataIndex: 'dictName',
	},
	{
		title: '字典编号',
		align: 'left',
		dataIndex: 'dictCode',
	},
	{
		title: '描述',
		align: 'left',
		dataIndex: 'description',
	},
	{
		title: '操作',
		dataIndex: 'action',
		align: 'center',
		width: 300,
		scopedSlots: { customRender: 'action' },
	},
]

export default {
	mixins: [dataListMixin],

	components: {
		DictDlg,
		DictItemDrawer,
		EditDictItemDlg,
	},

	data() {
		return {
			columns,
			url: {
				list: '/rbac/sys/dict/list',
			},

			visible: false,
			ctrlMode: 'add',

			visible2: false,
			visible3: false,
			ctrlMode3: 'add',
		}
	},

	methods: {
		//处理新增字典项操作
		handleAdd() {
			this.visible = true
			this.ctrlMode = 'add'
		},

		handleEdit(record) {
			this.visible = true
			this.ctrlMode = 'modify'
			this.$refs.dictDlg.setData(record)
		},

		//处理删除
		handleDel(record) {
			deleteDictItem({
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

		//处理字典配置
		handleEditDictItem(record) {
			this.visible2 = true
			this.$refs.dictItemDrawer.fetchData(record)
		},

		//打开字典详细信息编辑窗体
		openDictEditorDlg(payload) {
			const { ctrlMode, record } = payload
			this.visible3 = true
			this.ctrlMode3 = ctrlMode
			this.$refs.dictEditorDlg.setData(record)
		},

		//搜索字典详细值列表
		doDrawerSearch() {
			this.$refs.dictItemDrawer.searchQuery()
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
