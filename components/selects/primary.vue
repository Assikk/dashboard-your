<template>
  <div :class="label ? 'flex flex-col gap-2' : ''">
    <label :for="id">{{label}}</label>
    <v-select :placeholder="placeholder" :multiple="multi" :id="id" class="select" v-model="selectedValue"
    :class="[
    {'error': error}]" :reduce="list => list[valueList]" :options="list" :label="textList"/>
    <p class="text-sm text-[#ff0000] mt-1">
      <slot name="error"/>
    </p>
  </div>
</template>
<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: 'selectComponent',
  components: {
    vSelect
  },
  props: {
    id: {},
    label: {
      type: String
    },
    list: {
      type: Array,
      required: true
    },
    valueList: {
      type: String,
      required: true
    },
    textList: {
      type: String,
      required: true
    },
    value: {},
    error: {
      type: Boolean,
      default: false
    },
    multi: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit('input', newValue);
      }
    }
  }
}
</script>
<style scoped>
::v-deep .vs__dropdown-toggle {
  padding: 9px 8px;
  border-radius: 0.375rem;
}
::v-deep .error .vs__dropdown-toggle {
  border: 1px solid red;
}
::v-deep .vs__search {
  border: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
::v-deep .vs__actions {
  padding-right: 10px;
}
::v-deep .vs__selected {
  padding: 2px 10px;
  margin: 0 6px 0 0;
  background: transparent;
}
::v-deep .vs__deselect {
  margin-left: 8px;
}
::v-deep .vs__search::placeholder {
  color: #9ca3af;
}
</style>
