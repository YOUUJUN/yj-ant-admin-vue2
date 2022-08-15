<template>
    <a-layout class="root-wrap">
        <a-layout-header class="header-wrap">
            <nav-bar></nav-bar>
        </a-layout-header>
        <a-layout class="main-wrap">
            <a-layout-sider
                class="aside-wrap"
                theme="light"
                v-model="sidebar.opened"
                collapsible
                :width="sidebar.width"
            >
                <side-bar></side-bar>
            </a-layout-sider>
            <a-layout-content class="content-wrap">
                <section class="content">
                    <div class="inner-wrap">
                        <tabs-view></tabs-view>
                    </div>
                </section>
                <!-- <a-layout-footer class="foot-wrap">Footer</a-layout-footer> -->
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
const SideBar = () => import("./Parts/SideBar.vue");
const NavBar = () => import("./Parts/NavBar.vue");

const TabsView = () => import("./TabsView.vue");

import {mapGetters} from "vuex";

export default {
    name: "Layout",

    components: {
        SideBar,
        NavBar,

        TabsView,
    },

    data() {
        return {

        };
    },

    computed: {
        ...mapGetters(["sidebar"]),
    },

    methods: {


    },
};
</script>



<style scoped>
.root-wrap {
    display: flex;
    height: 100%;
}

.header-wrap {
    flex: none;
    height: 6rem;
    line-height: 6rem;
    padding: 0;
    background-color: #fff;
}

.main-wrap {
    flex: auto;
}

.aside-wrap{
    overflow: auto;
    border-right: .01rem solid #e8e8e8;
    overflow-x: hidden;
}

.content-wrap {
    display: flex;
    flex-direction: column;
}

.content {
    position: relative;
    flex: auto;
}

.inner-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    overflow-x: hidden;
}

.foot-wrap {
    flex: none;
}
</style>














