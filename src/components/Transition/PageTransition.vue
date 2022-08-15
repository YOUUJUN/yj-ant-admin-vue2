<template>
    <transition
        v-if="!disabled"
        :enter-active-class="`animated ${enterAnimate} page-toggle-enter-active`"
        :leave-active-class="`animated ${leaveAnimate} page-toggle-leave-active`"
    >
        <slot></slot>
    </transition>

    <div v-else><slot></slot></div>
</template>

<script>
export default {
    name: "PageTransition",
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
        };
    },

    computed: {
        enterAnimate() {
            return "slideInLeft";
        },

        leaveAnimate() {
            return "slideOutRight";
        },
    },

    methods: {

    },
};
</script>

<style scoped>
@import url("~@/assets/css/animation.css");

.page-toggle-enter-active {
    position: absolute !important;
    animation-duration: 0.8s !important;
    width: calc(100%) !important;
}
.page-toggle-leave-active {
    position: absolute !important;
    animation-duration: 0.8s !important;
    width: calc(100%) !important;
}
.page-toggle-enter {
}
.page-toggle-leave-to {
}
</style>