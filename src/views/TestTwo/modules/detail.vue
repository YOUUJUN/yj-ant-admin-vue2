<template>
    <a-modal
        :width="1100"
        :title="model.title"
        destroyOnClose
        :visible="visible"
        :confirm-loading="model.confirmLoading"
        @cancel="handleCancel"
    >
        <a-form-model
            ref="form"
            :model="form"
        >
            <a-descriptions class="description-wrap" title="User Info" :column="2" bordered>
                <a-descriptions-item >
                    <template slot="label">建档时间</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item>
                    <template slot="label">商家编号</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item >
                    <template slot="label">商家名称</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item>
                    <template slot="label">商家类型</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item >
                    <template slot="label">服务类别</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item>
                    <template slot="label">经营范围</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item >
                    <template slot="label">商家负责人</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item>
                    <template slot="label">负责人电话</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>

                <a-descriptions-item :span="2">
                    <template slot="label">机构地址</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>

                <a-descriptions-item >
                    <template slot="label">商家性质</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item>
                    <template slot="label">服务电话</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item >
                    <template slot="label">服务状态</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item>
                    <template slot="label">服务范围</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item >
                    <template slot="label">服务时间</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item>
                    <template slot="label">经营时间</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item >
                    <template slot="label">营业执照</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item>
                    <template slot="label">卫生许可证</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item >
                    <template slot="label">法人代表</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                <a-descriptions-item>
                    <template slot="label">统一社会信用代码</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>

                <a-descriptions-item :span="2">
                    <template slot="label">商家简介</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>

                <a-descriptions-item :span="2">
                    <template slot="label">附件管理</template>
                    <a-form-model-item>
                        <a-input />
                    </a-form-model-item>
                </a-descriptions-item>
                

            </a-descriptions>
        </a-form-model>

        <template slot="footer" v-if="ctrlModel === 'add'">
            <a-button key="back" @click="handleCancel"> 取消 </a-button>
            <a-button key="submit" type="primary" @click="">
                保存
            </a-button>
        </template>

        <template slot="footer" v-if="ctrlModel === 'view'">
            <a-button key="back" @click="handleCancel"> 关闭 </a-button>
        </template>

        <template slot="footer" v-if="ctrlModel === 'modify'">
            <a-button key="back" @click="handleCancel"> 取消 </a-button>
            <a-button key="submit" type="primary" @click="handleModifyOk">
                保存
            </a-button>
        </template>

    </a-modal>
</template>

<script>
export default {
    props: {
        visible: {
            default: false,
            type: Boolean,
        },
        ctrlModel : {
            default : 'add',
            type : String
        }
    },

    data() {
        return {
            model: {
                title: "",
                confirmLoading: false,
            },

            form: {},
        };
    },

    methods: {
        handleCancel() {
            this.$emit("update:visible", false);
        },
    },
};
</script>

<style>
</style>


<style scoped>

::v-deep .ant-form-item{
    margin:0;
}

::v-deep .ant-descriptions-bordered .ant-descriptions-item-label{
    padding: 0;
    text-align: center;
}

::v-deep .ant-descriptions-bordered .ant-descriptions-item-content{
    padding: 3px 6px;
}

::v-deep .ant-descriptions-bordered .ant-descriptions-item-label{
    /* background-color: #f2f2f2; */
    color:rgba(0, 0, 0, 0.65);
}

::v-deep .ant-descriptions-title{
    margin-bottom: 8px;
}


</style>

