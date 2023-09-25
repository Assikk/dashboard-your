<template>
  <div class="fixed top-0 bg-[#00000046] left-0 w-full h-full z-40 flex items-center justify-center">
    <div class="bg-[#F9F9F9] w-[90%] sm:w-3/4 h-[90%] overflow-y-auto rounded-lg px-12 py-10 flex flex-col gap-6">
      <div class="flex bg-white border border-gray rounded-md p-4 flex-col gap-4">
          <div class="flex gap-2">
            <img class="w-1/2 h-32 rounded" :src="file.file" :alt="file.alt">
            <div class="text-sm flex flex-col gap-2">
              <p>{{file.size / 1000}} KB</p>
              <p>
                {{file.width}} х {{file.height}}
              </p>
              <p class="cursor-pointer text-[#4F46E5]">
                Редактировать
              </p>
              <p class="cursor-pointer text-[#DC2626]"
              @click="$emit('deleteFile')">
                Удалить
              </p>
            </div>
          </div>
          <Input v-model="file.name" label="Название"/>
          <Input v-model="file.alt" label="Атрибут alt"/>
          <Input v-model="file.signature" label="Подпись"/>
          <Link v-model="file.file" label="Ссылка"/>
          <TextArea v-model="file.description" label="Описание"/>
          <div class="flex gap-4">
            <Button outlined :disabled="disabledSave"
            @click="$emit('save')">
              Сохранить
            </Button>
            <Button gray @click="closeModal">
              Закрыть
            </Button>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
import Button from "@/components/buttons/default.vue";
import Input from '@/components/inputs/default.vue'
import TextArea from '@/components/textarea.vue'
import Link from '@/components/inputs/link.vue'
export default {
  name: 'CardMediaFileModal',
  components: {
    Button,
    Input,
    TextArea,
    Link,
  },
  props: {
    file: {
      type: Object,
      default: {}
    },
    disabledSave: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapMutations({
      change_state: 'CHANGE_STATE'
    }),
    closeModal() {
      let payload = {
        key: 'isShowCardMediaFile',
        body: false
      }
      this.change_state(payload)
      this.$emit('close')
    }
  }
}
</script>
