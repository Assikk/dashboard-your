<template>
  <div class="mb-10">
    <div class="flex items-center gap-4 justify-between mb-4">
      <h1 class="font-bold text-2xl">
        Афиша
      </h1>
      <Button v-if="isShowAddButton" @click="$router.push('/poster/add')">
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
        <Search class="w-full" placeholder="Поиск Афиш по заголовку"
        v-model="search"
        @input="searchPoster"
        @search="searchPoster"/>
        <Select class="w-52" :list="$store.state.statusList" textList="title" valueList="value" active="Статус" id="status"
        @input="changeStatus"/>
        <Select class="w-24" :list="$store.state.langList" textList="text" valueList="code" active="Язык" id="lang"
        @input="changeLang"/>
      </div>
      <Loading v-if="isLoading" />
      <Table v-if="!isLoading" class="min-h-[103px]" :head="postersHead"
      @filtr="clickFiltr">
        <template #body>
          <tr v-for="(item, index) in postersBody" :key="index">
            <td class="w-[88px]">
              <img class="w-10 h-10 rounded-md" width="40" height="40" :src="item.poster.image" alt="Фото Афишы">
            </td>
            <td class="w-[484px] font-medium">
              <span class="poster-title">
                {{item.poster.title}}
              </span>
            </td>
            <td>
              <span>
                {{item.poster.lang}}
              </span>
            </td>
            <td>
              <span>
                {{item.poster.click_count}}
              </span>
            </td>
            <td>
              <p class="w-[105px] rounded-[10px] font-medium text-xs py-1 text-center"
              :class="(item.poster.status == 'Одобрено' || item.poster.status == 'Активный') ? 'bg-[#D1FAE5] text-[#065F46]' : (item.poster.status == 'Отказано' || item.poster.status == 'Удалено') ? 'bg-[#FEE2E2] text-[#991B1B]' : (item.poster.status == 'На модерации') ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#F3F4F6] text-[#1F2937]'">
                {{item.poster.status}}
              </p>
            </td>
            <td>
              <span>
                {{item.poster.created_at}}
              </span>
            </td>
            <td v-if="isShowEditIcon" class="w-16"
            @click="$router.push(`/poster/edit/${item.poster.id}`)">
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
      @click="(page) => getPosters(page)"/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Button from "@/components/buttons/default.vue";
import Search from '@/components/inputs/search.vue'
import Pagination from '@/components/pagination.vue'
import Table from '@/components/table.vue'
import FilterPosters from '@/components/filterTable.vue'
import Loading from '@/components/loading/table.vue'
import Select from '@/components/selects/default.vue'
export default {
  name: "posterPage",
  head: {
    title: 'Афиша'
  },
  components: {
    Button,
    Search,
    Pagination,
    Table,
    FilterPosters,
    Loading,
    Select
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
    isShowAddButton() { /* Переменная, проверяющая имеется ли доступ к показу кнопки */
      if(this.checkPermission('create-posters')) {
        return true
      } else false
    },
    isShowEditIcon() { /* Переменная, проверяющая имеется ли доступ к показу иконки редактирования */
      if(this.checkPermission('update-posters')) {
        return true
      } else false
    }
  },
  data() {
    return {
      postersHead: [ /* Переменная, хранит в себе данные шапки таблицы */
        {
          id: 1,
          title: 'Фото',
          isShowFiltr: false
        },
        {
          id: 2,
          title: 'Заголовок',
          isShowFiltr: false
        },
        {
          id: 3,
          title: 'Язык',
          isShowFiltr: false
        },
        {
          id: 4,
          title: 'Просмотры',
          isShowFiltr: true,
          filtr: ''
        },
        {
          id: 5,
          title: 'Статус',
          isShowFiltr: false
        },
        {
          id: 6,
          title: 'Дата',
          isShowFiltr: true,
          filtr: ''
        },
      ],
      postersBody: [], /* Переменная, хранит в себе список афиш */
      search: '', /* Переменная, хранит в себе значение введенное в поле поиска */
      meta: {}, /* Переменная, хранит в себе данные пагинации страницы */
      searchFilter: '', /* Переменная, хранит в себе ключ поиска фильтра */
      filter: '', /* Переменная, хранит в себе значение выбранного фильтра */
      isLoading: true, /* Переменная, хранит в себе статус страницы */
      activeLang: '', /* Активный язык */
      activeStatus: '', /* Активный статус */
    };
  },
  methods: {
    changeStatus(status) { /* Функция смены статуса */
      this.activeStatus = status /* Записываем выбранный статус в переменную */
      this.searchPoster() /* Делаем поиск */
    },
    changeLang(lang) { /* Функция смены языка */
      this.activeLang = lang /* Записываем в переменную выбранный язык */
      this.searchPoster() /* Делаем поиск */
    },
    clickFiltr(item) { /* Фукнция клика по фильтру таблицы */
      if(item.filtr == 'asc') {
        item.filtr = 'desc'
      } else item.filtr = 'asc'
      this.searchPoster() /* Делаем поиск */
    },
    async searchPoster() { /* Функция поиска афишы */
      this.isLoading = true /* Открываем загрузочное окно */
      let view_sort = this.postersHead.filter((item) => item.title == 'Просмотры')[0].filtr /* Находим фильтр просмотра */
      let create_sort = this.postersHead.filter((item) => item.title == 'Дата')[0].filtr /* Находим фильтр даты */
      this.postersBody = [] /* Очищаем массив данных афиш */
      let res = await this.$axios.get(`/search/posters?${this.activeLang ? `lang=${this.activeLang}&`: ''}${this.activeStatus ? `status=${this.activeStatus}&`: ''}${view_sort ? `view_sort=${view_sort}&`: ''}${create_sort ? `create_sort=${create_sort}&`: ''}&keyword=${this.search}`) /* Делаем сам запрос с фильтрами */
      this.isLoading = false /* Закрываем загрузечное окно */
      this.postersBody = res.data.data /* Сохраняем данные афиш */
      this.meta.last_page = 0 /* Делаем число последней страницы 0 чтобы скрыть пагинацию */
    },
    async getPosters(page = 1) { /* Get запрос афиш */
      this.isLoading = true /* Открываем загрузечное окно */
      this.postersBody = [] /* Очищаем список афиш */
      let res = await this.$axios.get(`/posters${this.filter}?page=${page}&lang=${this.activeLang}`) /* Сам запрос */
      this.isLoading = false /* Закрываем загрузечное окно */
      this.postersBody = res.data.data /* Записываем данные афиш в переменную */
      this.meta = res.data.meta /* Сохраняем meta данные пагинации */
    },
    checkPermission(name) { /* Функция проверки доступов */
      for (let i = 0; i < this.permissions.length; i++) {
        if (this.permissions[i].name === name) {
          return true;
        }
      }
      return false;
    }
  },
  beforeMount() {
    if(!this.checkPermission('read-posters')) { /* Если нет доступа то возвращаем на один роут назад */
      this.$router.back(-1)
    }
  },
  mounted() {
    this.getPosters()
  },
};
</script>
<style scoped>
.poster-title {
  overflow: hidden;
	text-overflow: ellipsis;
  display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
</style>
