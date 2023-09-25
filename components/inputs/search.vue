<template>
  <div class="flex items-center justify-between gap-2 bg-white py-2.5 px-3 border border-[#D1D5DB] shadow rounded-md text-sm"
  @keyup.enter="$emit('input', $event.target.value)">
    <div class="flex items-center gap-2 w-full">
      <svg width="20" height="20" fill="black" class="min-w-5 min-h-5 cursor-pointer"
      @click="$emit('search')">
        <use xlink:href="#search"></use>
      </svg>
      <input type="text" class="w-full outline-none bg-transparent"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)">
    </div>
  </div>
</template>
<script>
export default {
  name: 'SearchInput',
  props: {
    placeholder: {
      type: String
    },
    value: '',
  },
}
</script>
<style scoped>
.shadow {
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
