<template>
  <exception-page home-route="/index" :style="`min-height: 100vh`" type="403" />
</template>

<script>
import ExceptionPage from '@/components/Exception/ExceptionPage.vue'
export default {
  name: 'Exp403',
  components: {ExceptionPage},
}
</script>

<style scoped lang="less">
</style>
