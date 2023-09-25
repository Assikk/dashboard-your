<template>
  <div class="mb-10">
    <div class="flex items-center gap-4 justify-between mb-4">
      <h1 class="font-bold text-2xl">
        Теги
      </h1>
      <Button v-if="isShowAddButton" @click="$router.push('/tags/add')">
        Добавить
      </Button>
    </div>
    <div class="bg-white font-medium border border-[#E5E7EB]">
      <p class="py-3 px-6">
        Название тега
      </p>
      <div class="flex items-center justify-between gap-4 py-3 px-6 border-t border-[#E5E7EB]" v-for="tag in tags" :key="tag.id">
        <p>
          {{tag.name}}
        </p>
        <svg v-if="isShowEditIcon" @click="$router.push(`/tags/edit/${tag.id}`)" width="20" height="20" stroke="#374151" fill="none" class="cursor-pointer w-5 h-5">
          <use xlink:href="#edit"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Button from "@/components/buttons/default.vue";
export default {
  name: "tagsPage",
  components: {
    Button,
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
    isShowAddButton() {
      if(this.checkPermission('create-tags')) {
        return true
      } else false
    },
    isShowEditIcon() {
      if(this.checkPermission('update-tags')) {
        return true
      } else false
    }
  },
  data() {
    return {
      tags: []
    }
  },
  methods: {
    async getTags() {
      let res = await this.$axios.get('/tags')
      this.tags = res.data.data
    },
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
    if(!this.checkPermission('read-tags')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.getTags()
  }
};
</script>
