<template>
  <div>
    <Error404 v-if="error.statusCode === 404"/>
    <Error v-else/>
  </div>
</template>
<script>
import Error404 from '@/pages/404.vue'
import Error from '@/pages/error.vue'
export default {
  props: ['error'],
  components: {
    Error404,
    Error
  },
  layout: 'empty',
}
</script>
