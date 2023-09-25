<template>
    <div :class="label ? 'flex flex-col' : ''">
        <label :for="id" class="font-medium text-gray-700 mb-2">
            {{ label }}
        </label>
        <input :id="id" :type="type"
        :disabled="disabled"
        class="w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm border-gray-300"
        :class="[
          {'error': error},
          {'disabled': disabled}
        ]"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @blur="$emit('blur')"
        :placeholder="placeholder">
        <p class="text-sm text-[#ff0000] mt-1">
          <slot name="error"/>
        </p>
    </div>
</template>
<script>
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
      error: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
    }
}
</script>
<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
 .error {
  border: 1px solid #ff0000;
 }
</style>
