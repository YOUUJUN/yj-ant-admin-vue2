<template>
  <exception-page home-route="/dashboard/workplace" :style="`min-height: 100vh`" type="404" />
</template>

<script>
import ExceptionPage from '@/components/Exception/ExceptionPage.vue'
export default {
  name: 'Exp404',
  components: {ExceptionPage},
}
</script>

<style scoped lang="less">
</style>
