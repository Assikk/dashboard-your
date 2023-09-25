<template>
    <div :class="label ? 'flex flex-col' : ''">
        <label :for="id" class="font-medium text-gray-700 mb-2">
            {{ label }}
        </label>
        <div class="flex gap-2 justify-between items-center rounded-md border border-gray-300 shadow-sm bg-[#fafafa] px-3 py-2">
          <input :id="id" :type="type"
          disabled
          class="w-full placeholder-gray-400 focus:outline-none sm:text-sm text-[#0048B7]"
          :value="value"
          @input="$emit('input', $event.target.value)">
            <svg @click="copyToClipboard" width="20" height="20" fill="black" class="cursor-pointer">
              <use xlink:href="#copy"/>
            </svg>
        </div>
    </div>
</template>
<script>
import clipBoard from '@/plugins/clipBoard.js'
export default {
    name: 'Input',
    props: {
      id: {},
      label: {
        type: String
      },
      value: '',
      type: {
        type: String,
        default: 'text'
      },
    },
    methods: {
      copyToClipboard() {
        clipBoard(this.value)
      }
    }
}
</script>
