<template>
<div v-if="addFile" class="w-fit flex justify-center items-center gap-2 px-4 py-2 min-w-[126px] rounded-md bg-[#4F46E5] font-medium text-white shadow-sm text-center cursor-pointer transition ease-linear hover:bg-[#4338CA]"
:class="[
    {'outlined': outlined},
    {'full': full},
    {'gray': gray},
    {'secondary': secondary},
    {'warning': warning}
  ]"
  :disabled="disabled"
  @click="$emit('click')">
  <template>
    <slot name="prev-icon"/>
  </template>
  <slot/>
  <template>
    <slot name="next-icon"/>
  </template>
</div>
<button v-else class="w-fit flex justify-center items-center gap-2 px-4 py-2 min-w-[126px] rounded-md bg-[#4F46E5] font-medium text-white shadow-sm text-center cursor-pointer transition ease-linear hover:bg-[#4338CA]"
:class="[
    {'outlined': outlined},
    {'full': full},
    {'gray': gray},
    {'secondary': secondary},
    {'warning': warning}
  ]"
  :disabled="disabled"
  @click="$emit('click')">
  <template>
    <slot name="prev-icon"/>
  </template>
  <slot/>
  <template>
    <slot name="next-icon"/>
  </template>
</button>
</template>
<script>
export default {
  name: 'ButtonComponent',
  props: {
    outlined: {
      type: Boolean,
      default: false
    },
    full: {
      type: Boolean,
      default: false
    },
    addFile: {
      type: Boolean,
      default: false
    },
    gray: {
      type: Boolean,
      default: false
    },
    warning: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    secondary: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
.outlined {
  padding: 10px 13px;
  background: white;
  border: 1px solid #0048B7;
  color: #0048B7
}
button:disabled {
  background: #C7D2FE;
}
.full {
  width: 100%;
}
.gray {
  background: #FFFFFF;
  color: #374151;
  border: 1px solid #D1D5DB;
}
.gray:hover {
  background: #F9FAFB;
}
.gray:disabled {
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
  color: #D1D5DB;
}
.warning {
  background: #B91C1C;
  color: white;
}
.warning:hover {
  background: #DC2626;
}
.warning:disabled {
  background: #FCA5A5;
}
.secondary {
  background: #E0E7FF;
  color: #4338CA;
}
.secondary:hover {
  background:#C5D2FF;
}
.secondary:disabled {
  background: #E0E7FF;
  color: rgba(0, 0, 0, 0.20);
}
</style>
