<template>
    <a-drawer
        :title="modal.title"
        :maskClosable="true"
        :width="550"
        placement="right"
        :closable="true"
        :zIndex="999"
        @close="handleCancel"
        :visible="visible"
        style="height: 100%; overflow: auto; padding-bottom: 53px"
    >
        <article class="root">
            <a-form-model class="form-wrap" :model="detailForm">
                <a-form-model-item label="角色名称">
                    <a-input size="large" v-model="detailForm.roleName" disabled />
                </a-form-model-item>

                <a-form-model-item label="已选用户">
                    <section class="users-wrap">
                        <span v-for="item in usersList" class="ant-tag ant-tag-green">
                            {{item.username}}
                            <a-icon type="close" @click="handleRemoveUser(item.id)"/>
                        </span>
                    </section>
                </a-form-model-item>

                <a-form-model-item label="搜索用户">
                    <a-input
                        placeholder="请输入用户账号或用户姓名"
                        size="large"
                        v-model="detailForm.params"
                        @change="handleSearch"
                    />
                </a-form-model-item>
            </a-form-model>

            <a-table
                class="table"
                :columns="columns"
                bordered
                rowKey="id"
                :data-source="dataSource"
                :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :pagination="ipagination"
                @change="handleTableChange"
                :loading="loading"
            >
            </a-table>

            <div class="drawer-bootom-button">
                <a-button @click="handleEdit" type="primary">提交</a-button>

                <a-button style="margin: 0.8rem" @click="handleCancel">取消</a-button>
            </div>
        </article>
    </a-drawer>
</template>

<script>
import { getAction, postAction, putAction } from '@/api/manage'
import dataListMixin from '@/mixins/dataListMixin'

const columns = [
    {
        title: '序号',
        dataIndex: '',
        key: 'rowIndex',
        width: 90,
        align: 'center',
        customRender: function (t, r, index) {
            return parseInt(index) + 1
        },
    },

    {
        title: '用户账号',
        align: 'center',
        dataIndex: 'username',
    },

    {
        title: '用户名称',
        align: 'center',
        dataIndex: 'realname',
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
                title: '选择角色用户',
            },

            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },

            detailForm: {},

            url: {
                list: '/sys/user/list',
            },
            columns,
            loading: false,

            //数据缓存
            dataSource_cache: [],

            //用户列表
            usersList: [],
        }
    },

    watch: {
        //关闭时清除数据
        visible: {
            handler(newValue) {
                if (newValue === false) {
                    this.clearData()
                } else {
                }
            },
        },

        selectedRowKeys: {
            handler(newValue) {},
        },
    },

    created() {},

    methods: {
        clearData() {
            this.detailForm = this.$options.data().detailForm
            this.selectedRowKeys = []
            this.dataSource = this.dataSource_cache
        },

        setData(data) {
            this.detailForm = Object.assign({}, data.form)
            this.selectedRowKeys = data.list.map((item) => item.id)
            this.usersList = data.list
        },

        //设置已选用户
        setUsersList(list) {
            if (list.length === 0) {
                this.usersList = []
                return
            }
            this.usersList = list.map((id) => {
                let rowData = this.dataSource_cache.find((item) => item.id === id)
                return {
                    id,
                    username: rowData.username,
                }
            })

        },

        //处理复选框选中
        onSelectChange(selectedRowKeys, selectionRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectionRows = selectionRows

            this.setUsersList(selectedRowKeys)
        },

        //处理删除用户
        handleRemoveUser(id){
            let userIndex = this.usersList.findIndex(item => item.id === id)
            let selectIndex = this.selectedRowKeys.findIndex(item => item === id)

            this.usersList.splice(userIndex, 1)
            this.selectedRowKeys.splice(selectIndex, 1)
        },

        handleCancel() {
            this.$emit('update:visible', false)
        },

        //处理直接编辑角色
        handleEdit() {
            let userIdList = this.usersList.map(item => item.id)
            let payload = Object.assign({}, {
                roleId : this.detailForm.roleId,
                userIdList,
            })
            postAction('/sys/user/updateSysUserRole', payload)
                .then((res) => {
                    this.$message.success('分配角色所属用户成功!')
                    this.$emit('handleQuery')
                    this.handleCancel()
                })
                .catch((err) => {
                    this.$message.warning('分配角色所属用户失败!')
                    console.error('err', err)
                })
        },

        //处理搜索
        handleSearch(event) {
            let dataSource_cache = this.dataSource_cache
            let searchParams = this.detailForm.params
            if (!searchParams) {
                this.dataSource = dataSource_cache
                return
            }

            let result = dataSource_cache.reduce((previousValue, element, index) => {
                let username = element.username
                let realname = element.realname
                let id = element.id
                if (
                    username &&
                    username.includes(searchParams) &&
                    previousValue.findIndex((item) => item.id === id) === -1
                ) {
                    previousValue.push(element)
                }

                if (
                    realname &&
                    realname.includes(searchParams) &&
                    previousValue.findIndex((item) => item.id === id) === -1
                ) {
                    previousValue.push(element)
                }

                return previousValue
            }, [])

            this.dataSource = result
        },

        loadData(arg) {
            //加载数据 若传入参数1则加载第一页的内容
            if (arg === 1) {
                this.ipagination.current = 1
            }
            var params = this.getQueryParams() //查询条件
            this.loading = true
            getAction(this.url.list, params).then((res) => {
                if (res.success) {
                    let result = res.result.records || res.result
                    this.dataSource = result
                    this.dataSource_cache = result
                    if (res.result) {
                        this.ipagination.total = res.result.total
                    }
                }
                if (res.code === 510) {
                    this.$message.warning(res.message)
                }
                this.loading = false
                console.log('dataSource', this.dataSource)
                console.log('ipagination', this.ipagination)
            })
        },
    },
}
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 80px;
}

.form-wrap {
    width: 420px;
}

::v-deep .ant-form-item {
    margin-bottom: 5px;
}

.table {
    margin-top: 20px;
}

.drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
}
</style>