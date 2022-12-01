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
					<dict-select-tag
						placeholder="选择用户状态"
						v-model="queryParam.status"
						dictCode="user_status"
						style="width: 170px"
					/>
				</a-form-model-item>

				<a-form-model-item>
					<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
					<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
				</a-form-model-item>
			</a-form-model>

			<a-row :gutter="[8, 14]" style="margin: 14px 0">
				<a-col :span="24">
					<!-- <a-button @click="handleAdd" type="primary" icon="plus" v-has="'user:add'">新增用户</a-button>
					<a-button @click="handleDelBunch" type="primary" v-has="'users:delete'" style="margin-left: 8px">
						批量删除
					</a-button>
					<a-button @click="batchFrozen(1)" type="primary" v-has="'users:open'" style="margin-left: 8px">
						批量启用
					</a-button>
					<a-button @click="batchFrozen(2)" type="primary" v-has="'users:close'" style="margin-left: 8px">
						批量禁用
					</a-button>
					<a-button
						type="primary"
						icon="download"
						@click="handleExportXls('用户管理')"
						v-has="'user:export'"
						style="margin-left: 8px"
					>
						导出
					</a-button> -->
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
			>
				<template slot="status_dictText" slot-scope="text, record">
					<div>
						<span style="margin-right: 6px">{{ record.status == 1 ? '启用' : '禁用' }}</span>
						<a-switch
							:defaultChecked="record.status == 1"
							v-model="record.status"
							@change="(checked) => handleDisableUser(checked, record)"
							v-if="record.isAdmin !== '1'"
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
						v-if="record.status === false"
					>
						<a-button type="link" size="default" v-has="'user:delete'">删除</a-button>
					</a-popconfirm>
				</span>
			</a-table>
		</main>

		<footer></footer>
	</article>
</template>
<script>
import dataListMixin from '@/mixins/dataListMixin'

const columns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: 60,
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1
		},
	},
	{
		title: '用户账号',
		align: 'center',
		dataIndex: 'username',
		sorter: true,
	},
	{
		title: '用户姓名',
		align: 'center',
		dataIndex: 'realname',
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
		scopedSlots: { customRender: 'action' },
		align: 'center',
		width: 230,
	},
]

export default {
	mixins: [dataListMixin],

	data() {
		return {
			columns,

			url: {
				list: '/sys/user/list/',
			},
		}
	},

	methods: {
		//处理启用禁用
		handleDisableUser(checked, record) {
			let status = checked === true ? 1 : 2
			// putAction('/sys/user/frozenBatch', {
			// 	ids: record.id,
			// 	status,
			// })
			// 	.then((res) => {
			// 		record.status = checked === false ? false : true
			// 	})
			// 	.catch((err) => {})
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
