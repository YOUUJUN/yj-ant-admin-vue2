<template>
    <a-icon
        type="menu-fold"
        class="humburger"
        :class="{ 'is-active': !isActive }"
        @click="toggleClick"
    />
</template>

<script>
export default {
    props: {
        isActive: {
            type: Boolean,
            defaut : false,
        },
    },

    methods: {
        toggleClick() {
            this.$emit("toggleClick");
        },
    },
};
</script>

<style>
</style>

<style scoped>
.humburger {
    font-size: 2.2rem;
    cursor: pointer;
    transition: all 0.3s;
}

.humburger:hover{
    color: #13c2c2;
}

.humburger.is-active {
    transform: rotate(180deg);
}
</style>