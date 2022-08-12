<template>
    <div>
        <side-menu></side-menu>
    </div>
</template>

<script>
const SideMenu = () => import("@/components/Menu/SideMenu.vue")
export default {
    name : 'SideBar',
    components : {
        SideMenu
    }
};
</script>

<style>
</style>
