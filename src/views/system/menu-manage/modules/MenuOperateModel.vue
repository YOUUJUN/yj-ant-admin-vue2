<template>
	<a-drawer :visible="visible" :title="title" :width="drawerWidth" @close="handleCancel">
		<!-- <a-spin :spinning="confirmLoading">

        </a-spin> -->

		<main>
			<a-form-model ref="form" :model="form" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
				<a-form-model-item label="菜单级别">
					<a-radio-group @change="onChangeMenuType" v-model="form.menuType">
						<a-radio value="0">一级菜单</a-radio>
						<a-radio value="1">子菜单</a-radio>
						<a-radio value="2">按钮/权限</a-radio>
					</a-radio-group>
				</a-form-model-item>

				<a-form-model-item :label="menuLabel" :required="true" prop="name">
					<a-input placeholder="请输入菜单名称" v-model="form.name" :disabled="disableSubmit" />
				</a-form-model-item>

				<a-form-model-item v-show="localMenuType !== '0'" label="上级菜单" :required="true" prop="parentId">
					<a-tree-select
						style="width: 100%"
						:dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
						:treeData="treeData"
						v-model="form.parentId"
						placeholder="请选择父级菜单"
						:disabled="disableSubmit"
						@change="handleParentIdChange"
					></a-tree-select>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="菜单路径" :required="true" prop="url">
					<a-input placeholder="请输入菜单路径" v-model="form.url" :disabled="disableSubmit" />
				</a-form-model-item>

				<a-form-model-item v-show="show" label="前端组件" :required="true" prop="component">
					<a-input placeholder="请输入前端组件" v-model="form.component" :disabled="disableSubmit" />
				</a-form-model-item>

				<a-form-model-item
					v-show="localMenuType === '0'"
					label="默认跳转地址"
					:labelCol="labelCol"
					:wrapperCol="wrapperCol"
				>
					<a-input placeholder="请输入路由参数 redirect" v-model="form.redirect" :disabled="disableSubmit" />
				</a-form-model-item>

				<a-form-model-item v-show="!show" label="授权标识" prop="perms">
					<a-input
						placeholder="多个用逗号分隔, 如: user:list,user:create"
						v-model="form.perms"
						:disabled="disableSubmit"
					/>
				</a-form-model-item>

				<a-form-model-item v-show="!show" label="授权策略" prop="permsType">
					<a-radio-group v-model="form.permsType" :disabled="disableSubmit">
						<a-radio :value="1">可见/可访问(授权后可见/可访问)</a-radio>
						<a-radio :value="2">可编辑(未授权时禁用)</a-radio>
					</a-radio-group>
				</a-form-model-item>

				<a-form-model-item v-show="!show" label="状态">
					<a-radio-group v-model="form.status" :disabled="disableSubmit">
						<a-radio :value="0">无效</a-radio>
						<a-radio :value="1">有效</a-radio>
					</a-radio-group>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="菜单图标">
					<a-input placeholder="点击选择图标" v-model="form.icon" :disabled="disableSubmit">
						<a-icon slot="addonAfter" type="setting" @click="selectIcons" />
					</a-input>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="排序">
					<a-input-number
						placeholder="请输入菜单排序"
						style="width: 200px"
						v-model="form.sortNo"
						:disabled="disableSubmit"
					/>
				</a-form-model-item>

				<a-form-model-item label="平台类型" :required="true" prop="platformType">
					<a-radio-group v-model="form.platformType" :disabled="disableSubmit">
						<a-radio :value="item.id" :key="index" v-for="(item, index) of systemPlatforms">
							{{ item.name }}
						</a-radio>
					</a-radio-group>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="是否路由菜单">
					<a-switch
						checkedChildren="是"
						unCheckedChildren="否"
						v-model="form.isRoute"
						:disabled="disableSubmit"
					/>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="隐藏路由">
					<a-switch
						checkedChildren="是"
						unCheckedChildren="否"
						v-model="form.hidden"
						:disabled="disableSubmit"
					/>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="是否缓存路由">
					<a-switch
						checkedChildren="是"
						unCheckedChildren="否"
						v-model="form.keepAlive"
						:disabled="disableSubmit"
					/>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="聚合路由">
					<a-switch
						checkedChildren="是"
						unCheckedChildren="否"
						v-model="form.alwaysShow"
						:disabled="disableSubmit"
					/>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="打开方式">
					<a-switch
						checkedChildren="外部"
						unCheckedChildren="内部"
						v-model="form.internalOrExternal"
						:disabled="disableSubmit"
					/>
				</a-form-model-item>
			</a-form-model>
		</main>

		<footer class="footer-wrap">
			<a-button :style="{ marginRight: '8px' }" @click="handleCancel">关闭</a-button>
			<a-button :disabled="disableSubmit" @click="handleSave" type="primary">确定</a-button>
		</footer>
	</a-drawer>
</template>
<script>
import { queryTreeMenuList, addPermission, editPermission, duplicateCheck, fetchAllSystemPlatform } from '@/api/system'
import { errorCaptured } from '@/utils'

export default {
	inject: ['openIconChooseDlg_inject'],

	data() {
		return {
			//窗体控制
			visible: false,
			title: '',
			drawerWidth: 700,
			confirmLoading: false,

			//表单控制
			form: {
				menuType: '0',
				sortNo: 1,
				permsType: '1',
				status: '1',
				isRoute: true,
			},
			rules: {
				name: [{ required: true, validator: this.validateName }],
				parentId: [{ required: true, message: '请选择父级菜单!' }],
				component: [{ required: true, message: '请输入前端组件!' }],
				url: [{ required: true, message: '请输入菜单路径!' }],
				permsType: [{ required: true, message: '请输入授权策略!' }],
				perms: [{ validator: this.validatePerms }],
				platformType: [{ required: true, message: '请选择平台菜单类型!' }],
			},
			show: true, //显示隐藏菜单维护项与按钮维护项
			disableSubmit: false,
			localMenuType: '0', //菜单类型
			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},

			treeData: [],

			//系统平台
			systemPlatforms: [],
		}
	},

	computed: {
		menuLabel() {
			return this.form.menuType === '2' ? '按钮/权限' : '菜单名称'
		},
	},

	created() {
		this.getSystemPlatforms()
		console.log('systemPlatforms', this.systemPlatforms)
	},

	methods: {
		async initData(record = {}) {
			this.loadMenuTree()
			const originForm = this.$options.data.call(this).form
			this.$set(
				this,
				'form',
				Object.assign({}, originForm, record, {
					children: null,
				}),
			)
			delete this.form.children
			this.show = record.menuType === '2' ? false : true
			record?.menuType !== undefined && (this.localMenuType = record.menuType)
		},

		setData(record) {
			this.form = Object.assign({}, this.form, record)
		},

		//获取系统平台列表
		async getSystemPlatforms() {
			let payload = []
			const [err, msg] = await errorCaptured(fetchAllSystemPlatform)

			if (err) {
				console.error('err', err)
			}

			if (msg) {
				const { result } = msg
				payload = result
			}

			this.systemPlatforms = payload
			return payload
		},

		handleCancel() {
			this.visible = false
		},

		handleSave() {
			let needValidates = []
			switch (this.localMenuType) {
				case '0':
					needValidates = ['name', 'url', 'component']
					break
				case '1':
					needValidates = ['name', 'parentId', 'url', 'component']
					break
				case '2':
					needValidates = ['name', 'parentId', 'permsType']
					break
			}

			let validateResult = new Promise((resolve, reject) => {
				this.$refs['form'].validateField(needValidates, (validate) => {
					console.log('validate', validate)
					if (validate) {
						reject()
					}

					resolve()
				})
			})

			validateResult.then((res) => {
				if (this.form.id) {
					this.handleEdit(needValidates)
				} else {
					this.handleAdd(needValidates)
				}
			})
		},

		//处理新增请求
		handleAdd(needValidates) {
			console.log('form', this.form)
			addPermission(this.form)
				.then((res) => {
					const { success, message } = res
					if (success) {
						this.$message.success(message)
						this.$emit('doSearch')
					} else {
						this.$message.warning(message)
					}

					this.handleCancel()
				})
				.catch((err) => {
					console.error('err', err)
				})
				.finally(() => {})
		},

		//处理编辑请求
		handleEdit(needValidates) {
			this.confirmLoading = true
			console.log('form', this.form)
			editPermission(this.form)
				.then((res) => {
					const { success, message } = res
					if (success) {
						this.$message.success(message)
						this.$emit('doSearch')
					} else {
						this.$message.warning(message)
					}
				})
				.catch((err) => {
					console.error('err', err)
				})
				.finally(() => {
					this.confirmLoading = false
				})
		},

		//设置需要维护的菜单类型
		onChangeMenuType(e) {
			this.localMenuType = e.target.value
			if (e.target.value === '2') {
				this.show = false
			} else {
				this.show = true
			}
		},

		handleParentIdChange() {},

		//打开选择图标窗体
		selectIcons() {
			this.openIconChooseDlg_inject()
		},

		//获取树形结构菜单数据
		loadMenuTree() {
			queryTreeMenuList()
				.then((res) => {
					console.log('res', res)
					if (res.success) {
						let treeList = res.result.treeList
						this.treeData = treeList
					}
				})
				.catch((err) => {
					console.error('err', err)
				})
		},

		//验证name
		validateName(rule, value, callback) {
			let message = '请输入菜单标题!'
			if (this.localMenuType === '2') {
				message = '请输入按钮/权限 名称!'
			}

			if (!value) {
				callback(message)
			} else {
				callback()
			}
		},

		//验证授权标识
		validatePerms(rule, value, callback) {
			if (!value) {
				callback('请输入授权标识!')
				return
			}

			const params = {
				tableName: 'sys_permission',
				fieldName: 'perms',
				fieldVal: value,
				dataId: this.form.id,
			}
			duplicateCheck(params).then((res) => {
				if (res.success) {
					callback()
				} else {
					callback('授权标识已存在!')
				}
			})
		},
	},
}
</script>
<style scoped>
.footer-wrap {
	text-align: right;
}

::v-deep .ant-form-item-label {
	text-align: left;
	padding-left: 2rem;
}
</style>
