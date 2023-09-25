<template>
<div>
  <Icons/>
  <div class="relative grid xl:grid-cols-[256px_1fr] overflow-x-hidden " :class="{ 'h-screen overflow-y-hidden': MenuBtn }" >
    <Aside class="absolute xl:block translate-x-[-100%] xl:translate-x-0 ease-in duration-300 " :class="{ 'translate-x-0' : MenuBtn }"/>
    <div  class="border-l border-[#E5E7EB] z-10 bg-[#F8F8F9] min-h-screen w-full ease-in duration-300 " :class="{ 'overlay-body': MenuBtn, }">
      <Header/>
      <div @click="menuClose" @mouseover="closePrButtons"><transition name="fade"><Nuxt class="px-4 sm:px-8 my-[100px] " /></transition></div>
    </div>
  </div>
  <transition name="fade">
    <LogOut v-if="logout.isActive"/>
  </transition>
  <transition name="fade">
    <Alert v-if="alert.isActive"/>
  </transition>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import LogOut from '@/components/modals/logout.vue'
import Aside from '@/components/aside.vue';
import Alert from '@/components/alert.vue'
import Icons from '@/components/icons.vue'
import Header from '@/components/header.vue';
export default {
  name: 'DefaultLayout',
  components: {Aside, Header, LogOut, Alert, Icons},
  computed: {
      ...mapState({
        MenuBtn: state => state.MenuBtn,
        logout: state => state.logout,
        alert: state => state.alert.alert
      })
  },
  methods: {
    ...mapMutations({
      menuClose: 'menuClose',
      closePrButtons: 'closeProfileButtons',
    })
  },
}
</script>

<style>
  .overlay-body {
    filter: brightness(0.8) blur(0.8px);
  }
</style>
