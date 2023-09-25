<template>
  <div class="fixed bottom-9 z-10 right-9 max-w-[90%] w-max text-white rounded px-4 py-2 "
  :class="bgAlert">
    <p>
      {{alert.msg}}
    </p>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'AlertComponent',
  computed: {
    ...mapState({
      alert: state => state.alert.alert
    }),
    bgAlert() {
      let bgAlert
      switch (this.alert.type) {
        case 'error':
          bgAlert = 'bg-[#ff5252]'
          break;
        case 'success':
          bgAlert = 'bg-[#4caf50]'
          break;
        default:
          bgAlert = 'bg-[#2196f3]'
          break;
      }
      return bgAlert
    }
  }
}
</script>
