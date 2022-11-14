import { getAction, postAction } from '@/api/manage'

export default {
	data() {
		return {
			/* 查询条件-请不要在queryParam中声明非字符串值的属性 */
			queryParam: {},
			/* 数据源 */
			dataSource: [],
			/* 分页参数 */
			ipagination: {
				current: 1,
				pageSize: 10,
				pageSizeOptions: ['10', '20', '30'],
				showTotal: (total, range) => {
					return range[0] + '-' + range[1] + ' 共' + total + '条'
				},
				showQuickJumper: true,
				showSizeChanger: true,
				total: 0,
			},

			loading: false,

			/** 是否一进页面就开始加载数据 */
			loadByInit: true,

			url: {},
		}
	},

	created() {
		if (this.loadByInit) {
			this.loadData()
		}
	},

	methods: {
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
				postAction(this.url.list, params)
					.then((res) => {
						if (res?.data) {
							this.dataSource = res.data.records
							if (res.data.total) {
								this.ipagination.total = res.data.total
							}
						}

						resolve(res?.data)
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

		searchReset() {
			this.queryParam = Object.assign({}, this.$options.data.call(this).queryParam)
			this.loadData(1)
			this.$message.success('重置搜索项成功!')
		},

		getQueryParams() {
			//获取查询条件
			let sqp = {}
			var param = Object.assign(sqp, this.queryParam)
			param.pageNo = this.ipagination.current
			param.pageSize = this.ipagination.pageSize
			return param
		},

		handleTableChange(pagination) {
			this.ipagination = pagination
			this.loadData()
		},
	},
}
