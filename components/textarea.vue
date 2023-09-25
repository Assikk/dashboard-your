<template>
    <div :class="label ? 'flex flex-col' : ''">
      <label :for="id" class="text-sm font-medium text-gray-700">
          {{ label }}
      </label>
      <textarea :name="id" :id="id" :cols="cols" :rows="rows"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
      :class="[
        {'error': error},
        {'disabled': disabled}
      ]"
      class="w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm border-gray-300"/>
      <p v-if="error" class="text-sm text-[#ff0000] mt-1">
        <span v-if="errorRequired">
          Введите ссылку
        </span>
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
      error: {
        type: Boolean,
        default: false
      },
      errorRequired: {
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
      cols: {
        default: '20'
      },
      rows: {
        default: '5'
      }
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
