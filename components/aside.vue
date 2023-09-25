<template>
  <div
    class="overflow-y-hidden flex flex-col items-end sidebar-menu bg-[#F8F8F9] xl:bg-none h-full xl:h-auto p-2 w-[256px] absolute z-20 xl:z-10 top-0 left-0 xl:relative border-r border-[#E5E7EB] overflow-y-auto"
  >
    <div @click="menuClose" class="xl:hidden">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#9CA3AF" class="cursor-pointer">
        <use xlink:href="#close"/>
      </svg>
    </div>

    <div @click="menuClose" class="xl:fixed w-[92%]">
      <header class="mb-[53px] mt-4 mx-auto">
        <nuxt-link to="/"
          ><img class="mx-auto" src="@/assets/images/your.png" alt="your"
        /></nuxt-link>
      </header>
      <aside>
        <nav class="grid gap-2">
          <nuxt-link exact to="/" class="_menu-link">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              class="mr-[14px] fill-[#4B5563]"
            >
              <use xlink:href="#console"></use>
            </svg>
            <p class="_text">Консоль</p>
          </nuxt-link>
          <nuxt-link
            v-for="page in filtrPages"
            :key="page.index"
            :to="page.link"
            class="_menu-link"
          >
            <svg
              :width="page.width"
              :height="page.height"
              :viewBox="page.viewBox"
              class="mr-[14px] fill-[#4B5563]"
            >
              <use :xlink:href="'#' + page.icon"></use>
            </svg>
            <p class="_text">{{ page.text }}</p>
          </nuxt-link>
        </nav>
      </aside>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "asideComponent",
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
    ...mapGetters({
      filtrPages: 'filtrPages'
    })
  },
  methods: {
    ...mapMutations({
      menuClose: "menuClose",
    }),
  },
};
</script>

<style>
._menu-link:hover svg {
  fill: #0048b7;
}
._menu-link:hover ._text {
  color: #0048b7 !important;
  font-weight: 700;
}
.nuxt-link-active svg {
  fill: #0048b7;
}
</style>
