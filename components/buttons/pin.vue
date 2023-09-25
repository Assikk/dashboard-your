<template>
  <button class="flex items-center gap-2 border border-[#D1D5DB] rounded-lg text-sm px-4 py-2 cursor-pointer shadow"
  :class="active ? 'bg-[#0048B7] text-white' : ''"
  @click="$emit('click')">
    <svg width="20" height="20" :fill="active ? '#fff' : '#1F2937'"
    :class="active ? 'rotate-[270deg]' : ''">
      <use xlink:href="#pin"/>
    </svg>
    <p>
      {{active ? 'Открепить' : 'Закрепить'}}
    </p>
  </button>
</template>
<script>
export default {
  name: 'pinButton',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
.shadow {
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
}
</style>
