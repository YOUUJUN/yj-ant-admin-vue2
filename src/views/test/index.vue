<template>
	<section class="card-container">
		<header class="header-wrap">
			<div class="table-page-search-wrapper">
				<a-form-model ref="searchForm" class="search-form" layout="inline" :model="form">
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-model-item label="商家名称：">
								<a-input v-model="form.merchantName" placeholder="请输入商家名称" />
							</a-form-model-item>
						</a-col>

						<a-col :span="6">
							<div class="ctrl-wrap">
								<a-button type="primary" style="margin-left: 0.8rem" icon="reload" @click="handleReset">
									重置
								</a-button>
								<a-button type="primary" style="margin-left: 0.8rem" icon="search" @click="handleQuery">
									查询
								</a-button>
								<a-button type="primary" style="margin-left: 0.8rem" icon="search" @click="handleTest">
									测试
								</a-button>
							</div>
						</a-col>
					</a-row>
				</a-form-model>
			</div>

			<div class="btn-wrap">
				<a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
			</div>
		</header>

		<main class="main-wrap">
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
				<template slot="merchantLevel" slot-scope="text, record">
					<a-rate v-model="text" />
				</template>

				<template slot="operation" slot-scope="text, record">
					<a-button type="link">查看</a-button>
					<a-button type="link">修改</a-button>
					<a-popconfirm v-if="data.length" title="Sure to delete?" @confirm="() => handleDel(record.key)">
						<a-button type="link">删除</a-button>
					</a-popconfirm>
				</template>
			</a-table>
		</main>

		<footer></footer>

		<detail-model :visible.sync="visible"></detail-model>
	</section>
</template>

<script>
import dataListMixin from '@/mixins/data_list_mixin'
import { getAction, postAction } from '@/api/manage'

const detailModel = () => import('./modules/Detail.vue')

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
		title: '老人姓名',
		align: 'center',
		width: 250,
		dataIndex: 'name',
	},
	{
		title: '生日',
		align: 'center',
		dataIndex: 'birthday',
	},
	{
		title: '年龄',
		align: 'center',
		dataIndex: 'age',
	},
	{
		title: '照片路径',
		align: 'center',
		dataIndex: 'photo',
	},
	// {
	// 	title: '操作',
	// 	align: 'center',
	// 	width: 230,
	// 	dataIndex: 'operation',
	// 	scopedSlots: { customRender: 'operation' },
	// },
]

const data = []
for (let i = 0; i < 46; i++) {
	data.push({
		key: i,
		merchantName: `Edward King ${i}`,
		tel: 15656229989,
		serviceCategory: 1,
		serviceItem: 2,
		address: `London, Park Lane no. ${i}`,
		merchantCategory: 'ok',
		merchantProperty: 3,
		merchantLevel: 4,
	})
}

export default {
	mixins: [dataListMixin],

	components: {
		detailModel,
	},
	data() {
		return {
			form: {
				merchantName: '',
				serviceCategory: '',
				serviceItem: '',
				merchantProperty: '',
				merchantCategory: '',
			},

			data,
			columns,
			url: {
				list: '/provider/test/testPage',
			},
			selectedRowKeys: [], // Check here to configure the default column
			pagination: {
				pageSize: 10,
			},

			//窗体
			visible: false,

			//table
			loading: false,
			postMethod: true,
		}
	},

	computed: {
		rowSelection() {
			const { selectedRowKeys } = this
			return {
				selectedRowKeys,
				onChange: this.onSelectChange,
				hideDefaultSelections: true,
				selections: [
					{
						key: 'all-data',
						text: '全选',
						onSelect: () => {
							this.selectedRowKeys = [...Array(data.length).keys()] // 0...45
						},
					},
					{
						key: 'none-data',
						text: '全不选',
						onSelect: () => {
							this.selectedRowKeys = [] // 0...45
						},
					},
				],
				onSelection: this.onSelection,
			}
		},
	},

	methods: {
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys
		},

		openModel() {
			this.visible = true
		},

		handleAdd() {
			this.openModel()
		},

		//处理查询
		handleQuery() {
			postAction('/test/list', {})
				.then((res) => {
					console.log('res', res)
				})
				.catch((err) => {
					console.error('err', err)
				})
		},

		handleTest() {
			getAction('/test', {})
				.then((res) => {
					console.log('res', res)
				})
				.catch((err) => {
					console.error('err', err)
				})
		},

		//处理重置
		handleReset() {
			this.$refs.searchForm.resetFields()
			this.$message.success('重置搜索项成功!')
		},

		//处理删除
		handleDel() {},
	},
}
</script>

<style></style>

<style scoped>
.card-container {
	display: flex;
	flex-direction: column;
	background: #fff;
	padding: 2rem 1rem;
	overflow: auto;
}

.header-wrap {
	padding-left: 3rem;
}

.main-wrap {
	margin: 2rem;
}

.search-form {
	width: 100%;
}

.ctrl-wrap {
	display: flex;
	height: 100%;
	align-items: center;
}

.btn-wrap {
	margin-top: 1rem;
}
</style>
