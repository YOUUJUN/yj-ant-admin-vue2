<template>
	<a-drawer
		:title="modal.title"
		:maskClosable="true"
		:width="720"
		placement="right"
		:closable="true"
		@close="handleCancel"
		:visible="visible"
		style="height: 100%; overflow: auto; padding-bottom: 53px"
	>
		<article class="root">
			<header>
				<a-form-model layout="inline" @keyup.enter.native="searchQuery">
					<a-form-model-item label="名称">
						<a-input placeholder="输入名称" v-model="queryParam.itemText"></a-input>
					</a-form-model-item>

					<a-form-model-item label="状态">
						<a-select style="width: 170px" v-model="queryParam.status" placeholder="选择状态">
							<a-select-option :value="undefined">请选择</a-select-option>
							<a-select-option value="true">启用</a-select-option>
							<a-select-option value="false">禁用</a-select-option>
						</a-select>
					</a-form-model-item>

					<a-form-model-item>
						<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
						<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">
							重置
						</a-button>
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
						<a-popconfirm title="确定删除该字典项吗？" @confirm="() => handleDel(record)">
							<a-button type="link" size="default">删除</a-button>
						</a-popconfirm>
					</span>
				</a-table>
			</main>
		</article>
	</a-drawer>
</template>
<script>
import dataListMixin from '@/mixins/data_list_mixin'

const columns = [
	{
		title: '名称',
		align: 'center',
		dataIndex: 'itemText',
	},
	{
		title: '数据值',
		align: 'center',
		dataIndex: 'itemValue',
	},
	{
		title: '操作',
		dataIndex: 'action',
		align: 'center',
		width : 200,
		scopedSlots: { customRender: 'action' },
	},
]

export default {
	mixins: [dataListMixin],

	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			modal: {
				title: '字典列表',
			},

            columns,
			url: {
				list: '/sys/dictItem/list',
			},

			loadByInit: false,
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
	},

	methods: {
		fetchData(record) {
			const { id } = record
			Object.assign(this.queryParam, {
				dictId: id,
			})

			this.loadData(1)
		},

		clearData() {
			const queryParam = Object.assign({}, this.$options.data.call(this).queryParam)
			this.queryParam = { ...queryParam, ...this.dynamicParam }
		},

		handleCancel() {
			this.$emit('update:visible', false)
		},

		handleAdd(){
			let payload = {
				ctrlMode : 'add',
				record : Object.assign({}, this.queryParam),
			}
			this.$emit('openDictEditorDlg', payload)
		},

		handleEdit(record){
			let payload = {
				ctrlMode : 'modify',
				record : Object.assign({}, record, this.queryParam),
			}
			this.$emit('openDictEditorDlg', payload)
		},

		
	},
}
</script>
<style scoped></style>
