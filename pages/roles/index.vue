<template>
  <div>
    <h1 class="font-bold text-2xl">
      Роли
    </h1>
    <div class="shadow bg-white mt-10 flex flex-col border border-[#E5E7EB]">
      <div v-for="role in roles" :key="role.id"
      class="flex justify-between items-center gap-4 py-4 px-6"
      :class="role.id  == 2 ? 'border-y border-[#E5E7EB]' : ''">
        <p>
          {{role.title}}
        </p>
        <svg v-if="isShowEditIcon" width="16" height="16" stroke="#374151" fill="none" class="cursor-pointer"
        @click="$router.push(`/roles/edit/${role.id}`)">
          <use xlink:href="#edit"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "Roles",
  head: {
    title: 'Роли'
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
    isShowEditIcon() {
      if(this.checkPermission('update-roles')) {
        return true
      } else false
    }
  },
  data() {
    return {
      roles: [
        {
          id: 1,
          title: 'Администратор'
        },
        {
          id: 2,
          title: 'Редактор'
        },
        {
          id: 3,
          title: 'Автор'
        }
      ]
    }
  },
  methods: {
    checkPermission(name) {
      for (let i = 0; i < this.permissions.length; i++) {
        if (this.permissions[i].name === name) {
          return true;
        }
      }
      return false;
    }
  },
  beforeMount() {
    if(!this.checkPermission('read-roles')) {
      this.$router.back(-1)
    }
  },
};
</script>
<style scoped>
.shadow {
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);
}
</style>
