<template>
    <div class="flex flex-col gap-2">
        <label :for="id" class="text-sm font-medium text-gray-700">
          {{ label }}
        </label>
        <div class="bg-white border px-3 py-2 shadow-sm rounded-md flex justify-between items-center"
        :class="error ? 'border-[#ff0000]' : 'border-gray-300'">
          <input :id="id" :type="type"
          class="w-full placeholder-gray-400 focus:outline-none sm:text-sm"
          :value="value"
          @input="$emit('input', $event.target.value)">
          <div v-if="value.length > 0">
            <svg v-if="type == 'password'" width="24" height="20" fill="none" stroke="#4B55630" class="cursor-pointer"
            @click="type = 'text'">
              <use xlink:href="#openEye"></use>
            </svg>
            <svg v-else width="24" height="20" fill="none" stroke="#4B55630" class="cursor-pointer"
            @click="type = 'password'">
              <use xlink:href="#closeEye"></use>
            </svg>
          </div>
        </div>
        <p class="text-sm text-[#ff0000]">
          <slot name="error"/>
        </p>
    </div>
</template>
<script>
export default {
    name: 'PasswordInput',
    props: {
      id: {},
      label: {
        type: String
      },
      value: '',
      error: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        type: 'password'
      }
    }
}
</script>
