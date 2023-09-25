<template>
  <div  class="relative">
    <div class="top-admin grid grid-rows-2 grid-cols-1 justify-items-end px-8 py-2 items-center gap-x-4 shadow-black z-30 bg-white absolute top-0 left-0 w-full">
      <div @click="menuOpen" class="justify-self-start row-start-1 row-end-3 grid grid-rows-1 grid-cols-1 xl:hidden">
        <svg width="20" height="20" fill="none" stroke="#9CA3AF">
          <use xlink:href="#burgerMenu"></use>
        </svg>
      </div>
      <h2 @click="toggle" @mouseover="profileButtonsFalse" class="row-start-1 row-end-2 text-[14px] font-bold cursor-pointer">
        {{ user.first_name + ' ' + user.last_name }}
      </h2>
      <p @click="toggle" @mouseover="profileButtonsFalse" class=" cursor-pointer row-start-2 row-end-3 text-[12px] text-[#575F6C]">
        {{user.role.name}}
      </p>
      <div class="w-12 h-12 rounded-full row-start-1 row-end-3 hidden sm:block border cursor-pointer"
      @click="toggle" @mouseover="profileButtonsFalse">
        <img v-if="user.avatar == 'http://api.your.colibri.tj/storage/'" class="rounded-full w-12 h-12" src="/avatar.jpg" alt="User Avatar">
        <img v-else
          class="rounded-full w-12 h-12"
          :src="user.avatar"
          alt="User Avatar"
        />
      </div>
    </div>
    <div
      :class="{ 'open_profile': toggleProfile, 'hidden-profile-buttons': hiddenProfileButtons }"
      class="absolute right-8 flex flex-col translate-y-[-100%] ease-in duration-300 z-20"
    >
      <p
      @click="$router.push('/profile')"
        class="text-black px-4 py-3 bg-white rounded-md border border-[#E5E7EB] cursor-pointer"

        >Профиль</p
      >
      <p
        @click="logout"
        class="text-black px-4 py-3 bg-white rounded-md border border-[#E5E7EB] cursor-pointer"
      >
        Выход
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { mapMutations } from 'vuex';
export default {
  name: "headerComponent",
  data() {
    return {
      toggleProfile: false,
      crumbs: [{ name: "Пользователи" }],
      activeAction: 0,
      users: [],
      pageNumber: 0,
      removeId: 0,
      nextLink: "",
      activeUser: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user

    },
    ...mapState(['hiddenProfileButtons'])
  },

  methods: {
    ...mapMutations ({
      menuOpen: 'menuOpen',
      profileButtonsFalse: 'closeProfileButtonsFalse',
      change_state: 'CHANGE_STATE'
    }),
    toggle() {
      this.toggleProfile = !this.toggleProfile
    },
    logout() {
      let payload = {
        key: 'logout',
        body: {
          isActive: true
        }
      }
      this.change_state(payload)
    },
    removeItemModal(id) {
      this.removeId = id;
      this.$modal.show("example");
    },
    clickUser(user) {
      this.activeUser = user;
      this.$modal.show("user");
    },
    changeActiveAction(id) {
      if (id === this.activeAction) return (this.activeAction = 0);
      this.activeAction = id;
    },
  },
  mounted() {
    console.log(this.$store.state.auth.user);
  },
};
</script>

<style>
.top-admin {
  -webkit-box-shadow: 0px 1px 14px -10px rgba(0, 0, 0, 0.61);
  -moz-box-shadow: 0px 1px 14px -10px rgba(0, 0, 0, 0.61);
  box-shadow: 0px 1px 14px -10px rgba(0, 0, 0, 0.61);
}
.shadow {
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10);
}
</style>
