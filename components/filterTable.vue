<template>
  <div class="mt-4 mb-7 bg-white px-7 py-[22px] flex gap-2 items-center justify-between">
    <div class="w-4/5 flex items-center gap-12">
      <div class="flex gap-2 cursor-pointer "
      :class="active === item.code ? 'text-[#0048B7]' : 'hover:text-[#0048B7]'"
      v-for="item in filter" :key="item.id"
      @click="clickFilter(item)">
        <p class="font-bold" >
          {{item.text}}
        </p>
      </div>
    </div>
    <Lang v-if="lang" />
  </div>
</template>
<script>
import Lang from '@/components/lang/dropdown.vue'
export default {
  name: 'filterComponent',
  components: {
    Lang
  },
  props: {
    filter: {
      type: Array,
      default: []
    },
    lang: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active: ''
    }
  },
  methods: {
    clickFilter(val) {
      this.active = val.code
      this.$emit('click', val)
    }
  }
}
</script>
