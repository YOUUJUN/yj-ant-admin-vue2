<template>
	<article class="root">
		<header>
			<a-tabs defaultActiveKey="1" @change="switchLogType">
				<a-tab-pane tab="登录日志" key="1"></a-tab-pane>
				<a-tab-pane tab="操作日志" key="2"></a-tab-pane>
			</a-tabs>

			<a-form-model layout="inline" @keyup.enter.native="searchQuery">
				<a-form-model-item label="搜索日志">
					<a-input placeholder="请输入搜索日志" v-model="queryParam.keyWord"></a-input>
				</a-form-model-item>

				<a-form-model-item label="创建时间">
					<a-range-picker
						format="YYYY-MM-DD"
						:placeholder="['开始时间', '结束时间']"
						@change="onDateChange"
					/>
				</a-form-model-item>

				<a-form-model-item>
					<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
					<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
				</a-form-model-item>
			</a-form-model>
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
                style="margin-top:14px;"
			></a-table>
		</main>

		<footer></footer>
	</article>
</template>
<script>
import dataListMixin from '@/mixins/data_list_mixin'

const columns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1
		},
	},
	{
		title: '日志内容',
		align: 'left',
		dataIndex: 'logContent',
		scopedSlots: { customRender: 'logContent' },
	},
	{
		title: '操作人ID',
		dataIndex: 'userid',
		align: 'center',
	},
	{
		title: '操作人名称',
		dataIndex: 'username',
		align: 'center',
	},
	{
		title: 'IP',
		dataIndex: 'ip',
		align: 'center',
	},
	{
		title: '耗时(毫秒)',
		dataIndex: 'costTime',
		align: 'center',
	},
	{
		title: '日志类型',
		dataIndex: 'logType_dictText',
		/*customRender:function (text) {
              if(text==1){
                return "登录日志";
              }else if(text==2){
                return "操作日志";
              }else{
                return text;
              }
            },*/
		align: 'center',
	},
	{
		title: '创建时间',
		dataIndex: 'createTime',
		align: 'center',
	},
]

const operateColumn = {
	title: '操作类型',
	dataIndex: 'operateType_dictText',
	align: 'center',
}

export default {
	mixins: [dataListMixin],

	data() {
		return {
			url: {
				list: '/sys/log/list',
			},
            queryParam : {
                logType : 1,
            },
			columns,
		}
	},

	methods: {
		onDateChange: function (value, dateString) {
			this.queryParam.createTime_begin = dateString[0]
			this.queryParam.createTime_end = dateString[1]
		},

		//切换日志类型
		switchLogType(activeKey) {
			if (activeKey == 1) {
				this.columns = columns
			} else if (activeKey == 2) {
				this.tabKey = '2'
                let newColumns = [...columns]
                newColumns.splice(7, 0, operateColumn)
                this.columns = newColumns
			} 

			Object.assign(this.queryParam, {
				logType: activeKey,
			})

			this.loadData(1)
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
