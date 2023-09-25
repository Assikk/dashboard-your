<template>
  <div class="fixed top-0 bg-[#00000046] left-0 w-full h-full z-40 flex items-center justify-center">
    <div class="bg-[#F9F9F9] w-[90%] h-[90%] overflow-y-auto rounded-lg p-6">
      <div class="flex items-center justify-between gap-4 pb-3 border-b border-[#D1D5DB]">
        <p class="font-bold text-2xl">
          Позиции на сайте
        </p>
        <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer"
        @click="closeModal">
          <g clip-path="url(#clip0_2410_57070)">
          <path d="M18 33C9.7155 33 3 26.2845 3 18C3 9.7155 9.7155 3 18 3C26.2845 3 33 9.7155 33 18C33 26.2845 26.2845 33 18 33ZM18 30C21.1826 30 24.2348 28.7357 26.4853 26.4853C28.7357 24.2348 30 21.1826 30 18C30 14.8174 28.7357 11.7652 26.4853 9.51472C24.2348 7.26428 21.1826 6 18 6C14.8174 6 11.7652 7.26428 9.51472 9.51472C7.26428 11.7652 6 14.8174 6 18C6 21.1826 7.26428 24.2348 9.51472 26.4853C11.7652 28.7357 14.8174 30 18 30ZM18 15.879L22.242 11.6355L24.3645 13.758L20.121 18L24.3645 22.242L22.242 24.3645L18 20.121L13.758 24.3645L11.6355 22.242L15.879 18L11.6355 13.758L13.758 11.6355L18 15.879Z" fill="black"/>
          </g>
          <defs>
          <clipPath id="clip0_2410_57070">
          <rect width="36" height="36" fill="white"/>
          </clipPath>
          </defs>
        </svg>
      </div>
      <div class="flex flex-col gap-6 mt-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="item h-[429px]"
          @click="clickLocation('A1')">
            A1
          </div>
          <div class="item h-[429px]"
          @click="clickLocation('A2')">
            A2
          </div>
          <div class="item h-[429px]"
          @click="clickLocation('A3')">
            A3
          </div>
        </div>
        <div class="item h-[135px]"
        @click="clickLocation('A4')">
          A4
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="item h-[354px]"
          @click="clickLocation('A5')">
            A5
          </div>
          <div class="item h-[354px]"
          @click="clickLocation('A6')">
            A6
          </div>
        </div>
        <div class="item h-[135px]"
        @click="clickLocation('A7')">
          A7
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="item h-[430px]"
          @click="clickLocation('A8')">
            A8
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="item"
            @click="clickLocation('A9')">
              A9
            </div>
            <div class="item"
            @click="clickLocation('A10')">
              A10
            </div>
            <div class="item"
            @click="clickLocation('A11')">
              A11
            </div>
            <div class="item"
            @click="clickLocation('A12')">
              A12
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="item h-[354px]"
          @click="clickLocation('A13')">
            A13
          </div>
          <div class="item h-[354px]"
          @click="clickLocation('A14')">
            A14
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="item h-[429px]"
          @click="clickLocation('A15')">
            A15
          </div>
          <div class="banner h-[429px]">
            banner
          </div>
          <div class="item h-[429px]"
          @click="clickLocation('A16')">
            A16
          </div>
        </div>
        <div class="item h-[135px]"
        @click="clickLocation('A17')">
          A17
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="item h-[429px]"
          @click="clickLocation('A18')">
            A18
          </div>
          <div class="banner h-[429px]">
            banner
          </div>
          <div class="item h-[429px]"
          @click="clickLocation('A19')">
            A19
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
  name: 'LocationModal',
  methods: {
    ...mapMutations({
      change_state: 'CHANGE_STATE'
    }),
    closeModal() {
      let payload = {
        key: 'isShowLocation',
        body: false
      }
      this.change_state(payload)
    },
    clickLocation(id) {
      this.closeModal()
      this.$emit('clickLocation', id)
    }
  }
}
</script>
<style scoped>
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #D1D5DB;
  font-weight: 700;
  font-size: 36px;
  line-height: 49px;
  border-radius: 6px;
  cursor: pointer;
}
.banner {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #D1D5DB;
  font-weight: 700;
  font-size: 36px;
  line-height: 49px;
  border-radius: 6px;
}
</style>
