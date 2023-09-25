<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Tab",
  props: {
    name: { required: true },
    selected: { default: false }
  },
  data() {
    return {
        isActive: false,
    }
  },
  mounted() {
    this.isActive = this.selected
  }
};
</script>

<!-- <style>
.fadetab-enter-active,
.fadetab-leave-active {
  transition: opacity 0.3s ease;
}

.fadetab-enter-from,
.fadetab-leave-to {
  opacity: 0;
}
</style> -->