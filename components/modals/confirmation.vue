<template>
  <div class="fixed top-0 bg-[#00000046] left-0 w-full h-full z-40 flex items-center justify-center">
    <div class="bg-white max-w-[340px] text-center rounded-lg p-4 flex flex-col gap-4">
      <h2 class="text-[18px]">{{title}}</h2>
      <p class="text-sm text-[#4B5563]">
        {{description}}
      </p>
      <div class="flex flex-col gap-2">
        <Button warning full
        @click="$emit('click')">
          Подтвердить
        </Button>
        <Button gray full
        @click="closeModal">
          Отмена
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
import Button from '@/components/buttons/default.vue'
import {mapMutations} from 'vuex'
export default {
  name: 'LogoutModal',
  props: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  components: {
    Button
  },
  methods: {
    ...mapMutations({
      change_state: 'CHANGE_STATE'
    }),
    closeModal() {
      let payload = {
        key: 'showConfirmationModal',
        body: false
      }
      this.change_state(payload)
    },
  }
}
</script>
