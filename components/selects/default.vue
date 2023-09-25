<template>
  <div :class="label ? 'flex flex-col gap-2' : ''">
    <label :for="id">{{label}}</label>
    <select name="role" :id="id"
    class="w-full rounded-md border px-3 py-2.5 placeholder-gray-400 shadow-sm focus:outline-none border-gray-300 text-sm"
    :class="[
    {'error': error,},
    ]"
    :value="value"
    @input="$emit('input', $event.target.value)">
      <option selected hidden value="">{{active}}</option>
      <option :value="item[valueList]" v-for="(item, index) in list" :key="index"
      :selected="value == item.value">
        {{item[textList]}}
      </option>
    </select>
    <p class="text-sm text-[#ff0000]">
      <slot name="error"/>
    </p>
  </div>
</template>
<script>
import Icon from '@/assets/images/arrow-down.svg'
export default {
  name: 'selectComponent',
  props: {
    label: {
      type: String
    },
    id: {
      required: true,
      default: 'select'
    },
    list: {
      type: Array,
      required: true
    },
    value: {},
    active: {},
    error: {
      type: Boolean
    },
    textList: {
      type: String,
      required: true
    },
    valueList: {
      type: String,
      required: true
    },
    iconLocation: {
      type: String,
      default: '90'
    }
  },
  methods: {
    changeStyles() {
      let select = document.getElementById(this.id)
      select.style.webkitAppearance = 'none'
      select.style.background = `url(${Icon}) ${this.iconLocation}% 50% no-repeat`
    }
  },
  mounted() {
    this.changeStyles()
  }
}
</script>
<style scoped>
  .error {
    border: 1px solid #ff0000;
  }
</style>
