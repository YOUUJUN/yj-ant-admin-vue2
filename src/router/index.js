import Vue from "vue";
import VueRouter from "vue-router";

import Layout from "@components/Layout/Layout.vue";

Vue.use(VueRouter);

export const constantRoutes = [
    // {
    //     path: '/404',
    //     component: () => import('@/views/Error/404.vue'),
    // },

    {
        path: "/",
        component: Layout,
        meta: {
            title: "首页",
        },
        children: [
            {
                path: "",
                name: "Index",
                components: {
                    default: () => import("@views/Test/Index.vue"),
                },
                meta: {
                    title: "首页",
                },
            },
        ],
    },

    {
        path: "/elderinfo",
        redirect: "/elderinfo/registered",
        component: Layout,
        meta: {
            title: "老人信息",
        },
        children: [
            {
                path: "registered",
                name: "registered",
                components: {
                    default: () => import("@views/Test/Index.vue"),
                },
                meta: {
                    title: "在院老人",
                    // keepAlive : true,
                },
            },
            {
                path: "goout",
                name: "goout",
                components: {
                    default: () => import("@views/TestTwo/Index.vue"),
                },
                meta: {
                    title: "外出老人",
                    keepAlive : true,
                },
            },
            {
                path: "unregistered",
                name: "unregistered",
                components: {
                    default: () => import("@views/Test/Index.vue"),
                },
                meta: {
                    title: "出院老人",
                },
            },
            {
                path: "passed",
                name: "passed",
                components: {
                    default: () => import("@views/Test/Index.vue"),
                },
                meta: {
                    title: "死亡老人",
                },
            },
        ],
    },


    {
        path: "/healthcheck",
        redirect: "/healthcheck/daily",
        component: Layout,
        meta: {
            title: "健康检查",
        },
        children: [
            {
                path: "daily",
                name: "daily",
                components: {
                    default: () => import("@views/Test/Index.vue"),
                },
                meta: {
                    title: "日常检查",
                    // keepAlive : true,
                },
            },
            {
                path: "anomaly",
                name: "anomaly",
                components: {
                    default: () => import("@views/Test/Index.vue"),
                },
                meta: {
                    title: "异常提示",
                },
            },
        ],
    },


    {
        path: "/systemsetting",
        redirect: "/systemsetting/nursingproject",
        component: Layout,
        meta: {
            title: "系统设置",
        },
        children: [
            {
                path: "nursingproject",
                name: "nursingproject",
                components: {
                    default: () => import("@views/Test/Index.vue"),
                },
                meta: {
                    title: "护理项目",
                    // keepAlive : true,
                },
            },
            {
                path: "buildingmanagement",
                name: "buildingmanagement",
                components: {
                    default: () => import("@views/Test/Index.vue"),
                },
                meta: {
                    title: "楼栋管理",
                },
            },
            {
                path: "personnellabel",
                name: "personnellabel",
                components: {
                    default: () => import("@views/Test/Index.vue"),
                },
                meta: {
                    title: "人员标签",
                },
            },
        ],
    },

];

export const asyncRouters = [];

const router = new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes: constantRoutes,
});

export default router;
