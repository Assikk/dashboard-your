<template>
  <div>
    <transition name="fade">
    </transition>
    <div class="grid sm:grid-cols-[230px_1fr]">
      <div class="sm:border-r sm:border-[#F3F4F6] sm:p-8">
        <div class="flex flex-col justify-center items-center">
          <img v-if="user.avatar == 'http://api.your.colibri.tj/storage/'" class="mb-4 w-20 h-20 rounded-full" src="/avatar.jpg" alt="User Avatar" />
          <img v-else class="mb-4 w-20 h-20 rounded-full" :src="user.avatar" alt="User Avatar" />
          <addFile id="userAvatar" avatar accept="image/*"
          @upload="changeAvatar">
            <div class="py-2 w-fit px-3 rounded-md bg-white font-medium text-white shadow-sm text-center cursor-pointer border border-[#0048B7] text-[#0048B7]">
              Изменить фото
            </div>
          </addFile>
        </div>

        <div>
          <span
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectTab(tab)"
            class="text-black text-sm hover:text-[#0048B7] cursor-pointer font-medium block mb-5"
          >
            {{ tab.name }}
          </span>
          <span
            @click="exitModal"
            class="text-black text-sm hover:text-[#0048B7] cursor-pointer font-medium block mb-5"
            >Выход</span
          >
        </div>
      </div>
      <div>
        <slot> </slot>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapActions} from 'vuex'
import Button from '@/components/buttons/default.vue'
import addFile from '@/components/AddFile.vue'
export default {
  name: "settings-tab",
  components: {addFile, Button },
  data() {
    return {
      tabs: [],
    };
  },
  methods: {
    ...mapMutations({
      loading_alert: 'alert/LOADING_ALERT',
      change_state: 'CHANGE_STATE'
    }),
    ...mapActions({
      success_alert: 'alert/success_alert',
      error_alert: 'alert/error_alert'
    }),
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name === selectedTab.name;
      });
    },
    exitModal() {
      let payload = {
        key: 'logout',
        body: {
          isActive: true
        }
      }
      this.change_state(payload)
    },
    async onLogout() {
      await this.$auth.logout().then(() => this.$router.push("/login"));
    },
    async changeAvatar(photo) {
      try {
        this.loading_alert()
        let res = await this.$axios.post('/profile/avatar', photo)
        this.success_alert()
        const userToUpdate = {...this.$auth.user}
        userToUpdate.avatar = res.data.data;
        this.$auth.setUser(userToUpdate)
      } catch(err) {
        this.error_alert(err.response.data.message)
      }
    }
  },
  created() {
    this.tabs = this.$children;
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
};
</script>
