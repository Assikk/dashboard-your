<template>
  <div>
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      @click="selectTab(tab)"
      class="text-black font-bold text-sm bg-white px-3 py-2 rounded-md mr-5 mb-7 shadow-md border hover:border hover:border-[#4B5563] focus:border-[#4B5563]"
      :class="{'border-[#4B5563]': btnIsActive }"
    >
      {{ tab.name }}
    </button>
    <slot> </slot>
  </div>
</template>

<script>
export default {
  name: "tabs",
  data() {
    return {
      tabs: [],
      btnIsActive: false,
    };
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name === selectedTab.name;
      });
      
      // if (selectedTab.name == 'Соцсети') {
      //   this.btnIsActive = true;
      //   console.log('cliked')
      // }
    },
  },
  created() {
    this.tabs = this.$children;
  },
};
</script>
