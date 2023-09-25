<template>
  <div>
    <div class="flex items-center gap-4 justify-between mb-4">
      <h1 class="font-bold text-2xl">
        Публикации
      </h1>
      <Button @click="$router.push('/publications/add')">
        <template #prev-icon>
          <svg width="20" height="20" fill="white">
            <use xlink:href="#plus"/>
          </svg>
        </template>
        Добавить
      </Button>
    </div>
    <div class="bg-white pt-4 rounded-lg"
    :class="meta.last_page > 1 ? 'pb-4' : 'pb-0'">
      <div class="px-4 flex gap-4 mb-4">
        <Search class="w-full" placeholder="Поиск публикаций по заголовку"
        v-model="search" @input="searchPublication" @search="searchPublication"/>
        <Select class="flex-none w-40" :list="adminList" textList="title" valueList="value" active="Все" id="admin"/>
        <Select class="flex-none w-32" :list="headingsList" textList="title" valueList="value" active="Рубрики" id="headings"/>
        <Select class="flex-none w-36" :list="$store.state.statusList" textList="title" valueList="value" active="Статус" id="status"
        @input="changeStatus"/>
        <Select class="flex-none w-24" :list="$store.state.langList" textList="text" valueList="code" active="Язык" id="lang"
        @input="changeLang"/>
      </div>
      <Loading v-if="isLoading" />
      <Table v-if="!isLoading" class="min-h-[103px]" :head="publicatioinsHead"
      @filtr="clickFiltr">
        <template #body>
          <tr v-for="(item, index) in publicationsBody" :key="index"
          class="transition ease-linear cursor-pointer hover:bg-[#F3F4F6]"
          @click="$router.push(`/publications/${item.id}`)">
            <td class="w-[260px] font-medium">
              <span class="publication-title">
                {{item.title}}
              </span>
            </td>
            <td>
              <span>
                {{item.author.name}} {{item.author.last_name}}
              </span>
            </td>
            <td>
              <span>
                {{item.lang}}
              </span>
            </td>
            <td>
              <span>
                {{item.heading.name}}
              </span>
            </td>
            <td>
              <span>
                {{item.click_count}}
              </span>
            </td>
            <td>
              <span>
                {{item.created_at}}
              </span>
            </td>
            <td>
              <p class="w-[105px] rounded-[10px] font-medium text-xs py-1 text-center"
              :class="(item.status == 'Активный') ? 'bg-[#D1FAE5] text-[#065F46]' : (item.status == 'Удалено') ? 'bg-[#FEE2E2] text-[#991B1B]' : (item.status == 'На модерации') ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#F3F4F6] text-[#1F2937]'">
                {{item.status}}
              </p>
            </td>
            <td class="w-16"
            @click="$router.push(`/publications/edit/${item.id}`)">
              <svg width="20" height="20" stroke="#374151" fill="none" class="edit-icon">
                <use xlink:href="#edit"></use>
              </svg>
            </td>
          </tr>
        </template>
      </Table>
      <Pagination
      v-if="meta.last_page > 1"
      :lastPage="meta.last_page"
      :total="meta.total"
      :to="meta.to"
      @click="(page) => getPublications(page)"/>
    </div>
  </div>
</template>
<script>
import Button from "@/components/buttons/default.vue"
import Search from '@/components/inputs/search.vue'
import Select from '@/components/selects/default.vue'
import Table from '@/components/table.vue'
import Loading from '@/components/loading/table.vue'
import Pagination from '@/components/pagination.vue'
export default {
  name: 'PublicationsPage',
  head: {
    title: 'Публикации'
  },
  components: {
    Button,
    Search,
    Select,
    Table,
    Loading,
    Pagination
  },
  data() {
    return {
      search: '', /* Переменная, хранит в себе значение введенное в поле поиска */
      publicatioinsHead: [ /* Переменная, хранит в себе данные шапки таблицы */
        {
          id: 1,
          title: 'Заголовок',
          isShowFiltr: false
        },
        {
          id: 2,
          title: 'Администратор',
          isShowFiltr: false
        },
        {
          id: 3,
          title: 'Язык',
          isShowFiltr: false
        },
        {
          id: 4,
          title: 'Рубрики',
          isShowFiltr: false,
        },
        {
          id: 5,
          title: 'Просмотры',
          isShowFiltr: true,
          filtr: ''
        },
        {
          id: 6,
          title: 'Дата',
          isShowFiltr: true,
          filtr: ''
        },
        {
          id: 7,
          title: 'Статус',
          isShowFiltr: false,
        }
      ],
      publicationsBody: [], /* Переменная, хранит в себе список публикаций */
      adminList: [ /* Переменная, хранит в себе список администраторов */
        {
          id: 1,
          value: 'Все',
          title: 'Все'
        },
        {
          id: 2,
          value: 'Администратор',
          title: 'Администратор'
        },
        {
          id: 3,
          value: 'Автор',
          title: 'Автор'
        },
        {
          id: 4,
          value: 'Редактор',
          title: 'Редактор'
        },
      ],
      headingsList: [ /* Переменная, хранит в себе список рубрик */
        {
          id: 1,
          value: 'Все',
          title: 'Все'
        },
        {
          id: 2,
          value: 'Новости',
          title: 'Новости'
        },
        {
          id: 3,
          value: 'Истории',
          title: 'Истории'
        },
        {
          id: 4,
          value: 'Подкасты',
          title: 'Подкасты'
        },
      ],
      isLoading: true, /* Переменная, хранит в себе статус страницы */
      meta: {}, /* Переменная, хранит в себе данные пагинации страницы */
      activeLang: '', /* Активный язык */
      activeStatus: '', /* Активный статус */
    }
  },
  methods: {
    async getPublications(page = 1) {
      this.isLoading = true
      this.publicationsBody = []
      let res = await this.$axios.get(`/posts?page=${page}`)
      this.isLoading = false
      this.publicationsBody = res.data.data
      // this.meta = res.data.meta /* Сохраняем meta данные пагинации */
    },
    async searchPublication() {
      this.isLoading = true
      let view_count = this.publicatioinsHead.filter((item) => item.title == 'Просмотры')[0].filtr /* Находим фильтр просмотра */
      let create_sort = this.publicatioinsHead.filter((item) => item.title == 'Дата')[0].filtr /* Находим фильтр даты */
      this.publicationsBody = []
      let res = await this.$axios.get(`/search/posts?${this.activeLang ? `lang=${this.activeLang}&` : ''}${this.activeStatus ? `status=${this.activeStatus}` : ''}${view_count ? `view_count=${view_count}&`: ''}${create_sort ? `create_sort=${create_sort}&`: ''}keyword=${this.search}`)
      this.isLoading = false
      this.publicationsBody = res.data.data
      this.meta.last_page = 0
    },
    async changeLang(lang) {
      this.activeLang = lang
      await this.searchPublication()
    },
    async changeStatus(status) {
      this.activeStatus = status
      await this.searchPublication()
    },
    async clickFiltr(item) {
      if(item.filtr == 'asc') {
        item.filtr = 'desc'
      } else item.filtr = 'asc'
      await this.searchPublication()
    }
  },
  mounted() {
    this.getPublications()
  }
}
</script>
<style scoped>
.publication-title {
  overflow: hidden;
	text-overflow: ellipsis;
  display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}
</style>
