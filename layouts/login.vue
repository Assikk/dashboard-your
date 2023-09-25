<template>
  <section>
    <Nuxt/>
    <transition name="fade">
      <Alert v-if="alert.isActive"/>
    </transition>
    <Icons/>
  </section>
</template>

<script>
import {mapState} from 'vuex'
import Icons from '@/components/icons.vue'
import Alert from '@/components/alert.vue'
export default {
  name: 'loginLayout',
  components: {
    Alert, Icons
  },
  computed: {
    ...mapState({
      alert: state => state.alert.alert
    })
  }
}
</script>
