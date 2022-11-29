<template>
	<a-drawer
		:visible="visible"
		:title="title"
		:width="drawerWidth"
		:confirmLoading="confirmLoading"
		@close="handleCancel"
	>
		<!-- <a-spin :spinning="confirmLoading">

        </a-spin> -->

		<main>
			<a-form-model ref="form" :model="form" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
				<a-form-model-item label="菜单类型">
					<a-radio-group @change="onChangeMenuType" v-model="form.menuType">
						<a-radio :value="0">一级菜单</a-radio>
						<a-radio :value="1">子菜单</a-radio>
						<a-radio :value="2">按钮/权限</a-radio>
					</a-radio-group>
				</a-form-model-item>

				<a-form-model-item :label="menuLabel" :required="true" prop="name">
					<a-input placeholder="请输入菜单名称" v-model="form.name" :readOnly="disableSubmit" />
				</a-form-model-item>

				<a-form-model-item v-show="localMenuType != 0" label="上级菜单" :required="true" prop="parentId">
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
					<a-input placeholder="请输入菜单路径" v-model="form.url" :readOnly="disableSubmit" />
				</a-form-model-item>

				<a-form-model-item v-show="show" label="前端组件" :required="true" prop="component">
					<a-input placeholder="请输入前端组件" v-model="form.component" :readOnly="disableSubmit" />
				</a-form-model-item>

				<a-form-model-item
					v-show="localMenuType == 0"
					label="默认跳转地址"
					:labelCol="labelCol"
					:wrapperCol="wrapperCol"
				>
					<a-input placeholder="请输入路由参数 redirect" v-model="form.redirect" :readOnly="disableSubmit" />
				</a-form-model-item>

				<a-form-model-item v-show="!show" label="授权标识" prop="perms">
					<a-input
						placeholder="多个用逗号分隔, 如: user:list,user:create"
						v-model="form.perms"
						:readOnly="disableSubmit"
					/>
				</a-form-model-item>

				<a-form-model-item v-show="!show" label="授权策略" prop="permsType">
					<dict-select-tag
						v-model="form.permsType"
						placeholder="请选择授权策略"
						type="radio"
						:triggerChange="true"
						:disabled="disableSubmit"
						dictCode="global_perms_type"
					></dict-select-tag>
				</a-form-model-item>

				<a-form-model-item v-show="!show" label="状态">
					<dict-select-tag
						v-model="form.status"
						placeholder="请选择状态"
						type="radio"
						:triggerChange="true"
						:disabled="disableSubmit"
						dictCode="valid_status"
					></dict-select-tag>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="菜单图标">
					<a-input placeholder="点击选择图标" v-model="form.icon" :readOnly="disableSubmit">
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

				<!-- <a-form-model-item label="菜单平台类型">
					<a-radio-group v-model="form.platformType" :disabled="disableSubmit">
						<a-radio :value="1">监管</a-radio>
						<a-radio :value="2">运营</a-radio>
						<a-radio :value="3">服务商</a-radio>
					</a-radio-group>
				</a-form-model-item> -->

				<a-form-model-item v-show="show" label="是否路由菜单">
					<a-switch
						checkedChildren="是"
						unCheckedChildren="否"
						v-model="form.routeSwitch"
						:disabled="disableSubmit"
					/>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="隐藏路由">
					<a-switch
						checkedChildren="是"
						unCheckedChildren="否"
						v-model="form.menuHidden"
						:disabled="disableSubmit"
					/>
				</a-form-model-item>

				<a-form-model-item v-show="show" label="是否缓存路由">
					<a-switch
						checkedChildren="是"
						unCheckedChildren="否"
						v-model="form.isKeepalive"
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

		<footer>
			<a-button :style="{ marginRight: '8px' }" @click="handleCancel">关闭</a-button>
			<a-button :disabled="disableSubmit" @click="handleSave" type="primary">确定</a-button>
		</footer>
	</a-drawer>
</template>
<script>
export default {
	data() {
		return {
			//窗体控制
			visible: false,
			title: '',
			drawerWidth: 700,
			confirmLoading: false,

			//表单控制
			form: {
				menuType: 0,
				sortNo: 1,
				permsType: 1,
				status: 1,
			},
			rules: {
				name: [{ required: true, validator: this.validateName }],
				parentId: [{ required: this.localMenuType != 0, message: '请选择父级菜单!' }],
				component: [{ required: this.show, message: '请输入前端组件!' }],
				url: [{ required: this.show, message: '请输入菜单路径!' }],
				permsType: [{ required: !this.show, message: '请输入授权策略!' }],
				perms: [{ required: !this.show, message: '请输入授权标识!' }, { validator: this.validatePerms }],
			},
			show: true, //显示隐藏菜单维护项与按钮维护项
			disableSubmit: false,
			localMenuType: 0, //菜单类型
			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},

			//动态字段label
			menuLabel: '菜单名称',

			treeData: [],
		}
	},

	methods: {
		initData(record) {
			this.$set(this, 'form', Object.assign({}, this.form, record))
		},

		handleCancel() {
			this.visible = false
		},

		handleSave() {
			if (this.form.id) {
				this.handleEdit()
			} else {
				this.handleAdd()
			}
		},

		//处理新增请求
		handleAdd() {
			this.$refs['form'].validate((valid) => {
				console.log('valid', valid)
			})
		},

		//处理编辑请求
		handleEdit() {},

		//设置需要维护的菜单类型
		onChangeMenuType(e) {
			this.localMenuType = e.target.value
			if (e.target.value == 2) {
				this.show = false
				this.menuLabel = '按钮/权限'
			} else {
				this.show = true
				this.menuLabel = '菜单名称'
			}
		},

		handleParentIdChange() {},

		//打开选择图标窗体
		selectIcons() {},

		//验证name
		validateName(rule, value, callback) {
			let message = '请输入菜单标题!'
			if (this.localMenuType == 2) {
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
				// dataId: this.model.id,
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
<style scoped></style>
