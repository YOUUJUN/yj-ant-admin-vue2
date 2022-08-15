import router from "@/router";
import store from "@/store";

import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style

import { getToken } from "@/utils/auth";

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
    NProgress.start(); // start progress bar
    /* must call `next` */
    const hasToken = getToken();
    console.log("hasToken", hasToken);
    if (hasToken) {
        next();
        NProgress.done();

        // if(to.path === '/login'){
        //     next({path : '/'});
        // }else{
        //     /*--从VUEX中判断是否有权限--*/
        //     const hasRoles = store.getters.roles && store.getters.roles.length > 0
        //     if(hasRoles){
        //         next();
        //     }else{
        //         /*--如果没有，尝试获取--*/
        //         try{
        //             const { roles } = await store.dispatch('user/getInfo');

        //             //通过权限列表动态生成前端路由
        //             const accessedRoutes = await store.dispatch('permission/generateRoutes', roles);

        //             accessedRoutes.forEach(route => {
        //                 router.addRoute(route);
        //             });

        //             next({...to, replace : true});
        //         }catch(err){
        //             /*--处理向后台请求用户信息接口错误--*/
        //             await store.dispatch('user/resetToken');
        //             next(`/login?redirect=${to.path}`);

        //         }
        //     }

        // }
    } else {
        console.log("no token");
        /*no token*/
        if (whiteList.includes(to.path)) {
            next();
        } else {
            next(`/login?redirect=${to.path}`);
        }
        NProgress.done();
    }
});

router.afterEach(() => {
    NProgress.done(); // finish progress bar
});
