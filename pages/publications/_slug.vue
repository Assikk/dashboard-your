<template>
  <div>
    <h1 class="font-bold text-2xl">
      Информация о публикации
    </h1>
    <div v-if="publication" class="mt-4 p-4 bg-white rounded-lg flex flex-col gap-8">
      <div>
        <h2 class="text-lg font-medium text-[#0048B7] mb-3.5">
          Автор
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium text-[#6B7280]">
              Имя
            </p>
            <p>
              {{publication.author.name}}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium text-[#6B7280]">
              Фамилия
            </p>
            <p>
              {{publication.author.last_name}}
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium text-[#6B7280]">
              Электронная почта
            </p>
            <p>
              test@gmail.com
            </p>
          </div>
        </div>
      </div>
      <!-- <div>
        <h2 class="text-lg font-medium text-[#0048B7] mb-3.5">
          Редактор
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium text-[#6B7280]">
              Имя
            </p>
            <p>
              Абуамриддин
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium text-[#6B7280]">
              Фамилия
            </p>
            <p>
              Гафуров
            </p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-sm font-medium text-[#6B7280]">
              Электронная почта
            </p>
            <p>
              test@gmail.com
            </p>
          </div>
        </div>
      </div> -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <div class="flex flex-col gap-1">
          <p class="text-sm font-medium text-[#6B7280]">
            Название публикации
          </p>
          <p class="text-[#0048B7]">
            {{publication.title}}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-sm font-medium text-[#6B7280]">
            Дата публикации
          </p>
          <p>
            {{publication.created_at}}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-sm font-medium text-[#6B7280]">
            Статус
          </p>
          <p class="text-[#9CA3AF]">
            {{publication.status}}
          </p>
        </div>
      </div>
      <!-- <div class="flex flex-col gap-1">
        <p class="text-sm font-medium text-[#6B7280]">
          Комментарий редактора
        </p>
        <p>
          Исправить заголовок, описание.
        </p>
      </div> -->
      <div class="flex flex-col sm:flex-row gap-5">
        <Button @click="$router.push(`/publications/edit/${$route.params.slug}`)">
          Перейти к публикации
        </Button>
        <Button gray
        @click="$router.push('/publications')">
          Назад
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
import Button from '@/components/buttons/default.vue'
export default {
  name: 'ShowPublicationPage',
  components: {
    Button
  },
  data() {
    return {
      publication: null
    }
  },
  methods: {
    async getPublication() {
      let res = await this.$axios.get(`/posts/${this.$route.params.slug}`)
      this.publication = res.data.data
    }
  },
  async mounted() {
    await this.getPublication()
  }
}
</script>
