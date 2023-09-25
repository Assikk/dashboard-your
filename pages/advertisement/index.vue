<template>
  <div class="mb-10">
    <div class="flex items-center gap-4 justify-between mb-4">
      <h1 class="font-bold text-2xl">
        Реклама
      </h1>
      <Button v-if="isShowAddButton" @click="$router.push('/advertisement/add')">
        <template #prev-icon>
          <svg width="20" height="20" fill="white">
            <use xlink:href="#plus"/>
          </svg>
        </template>
        Добавить
      </Button>
    </div>
    <div class="bg-white py-4 rounded-lg">
      <div class="px-4 flex gap-4 mb-4">
        <Search class="w-full" placeholder="Поиск рекламы по названию"
        v-model="search"
        @input="searchAdvertisement"
        @search="searchAdvertisement"/>
        <Select class="w-52" :list="$store.state.statusList" textList="title" valueList="value" active="Статус" id="status"
        @input="changeStatus"/>
      </div>
      <Loading v-if="isLoading" />
      <Table v-if="!isLoading" class="min-h-[103px]" :head="advertisementHead"
      @filtr="clickFiltr">
        <template #body>
          <tr v-for="(item, index) in advertisementBody" :key="index">
            <td>
              <span>
                {{item.id}}
              </span>
            </td>
            <td>
              <span>
                {{item.client}}
              </span>
            </td>
            <td>
              <span>
                {{item.name}}
              </span>
            </td>
            <td>
              <span>
                {{item.start}}
              </span>
            </td>
            <td>
              <span>
                {{item.finish}}
              </span>
            </td>
            <td>
              <span>
                {{item.view_count}}
              </span>
            </td>
            <td>
              <span>
                0
              </span>
            </td>
            <td>
              <span>
                {{item.click_count}}
              </span>
            </td>
            <td>
              <p class="w-[105px] rounded-[10px] font-medium text-xs py-1 text-center"
              :class="(item.status == 'Одобрено' || item.status == 'Активный') ? 'bg-[#D1FAE5] text-[#065F46]' : (item.status == 'Отказано' || item.status == 'Удалено') ? 'bg-[#FEE2E2] text-[#991B1B]' : (item.status == 'На модерации') ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#F3F4F6] text-[#1F2937]'">
                {{item.status}}
              </p>
            </td>
            <td v-if="isShowEditIcon" class="w-16"
            @click="$router.push(`/advertisement/edit/${item.id}`)">
              <svg width="16" height="16" stroke="#374151" fill="none" class="edit-icon">
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
      @click="(page) => get_advertisement(page)"/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Button from "@/components/buttons/default.vue";
import Search from '@/components/inputs/search.vue'
import Loading from '@/components/loading/table.vue'
import Select from '@/components/selects/default.vue'
export default {
  name: "addvertisementPage",
  components: {
    Button, Search, Loading, Select
   },
   computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
    isShowAddButton() {
      if(this.checkPermission('create-advertising')) {
        return true
      } else false
    },
    isShowEditIcon() {
      if(this.checkPermission('update-advertising')) {
        return true
      } else false
    }
  },
   data() {
    return {
      advertisementHead: [ /* Переменная, хранит в себе данные шапки таблицы */
        {
          id: 1,
          title: 'ID',
        },
        {
          id: 2,
          title: 'Клиент'
        },
        {
          id: 3,
          title: 'Название'
        },
        {
          id: 4,
          title: 'Дата начала',
          isShowFiltr: true,
          filtr: ''
        },
        {
          id: 5,
          title: 'Дата окончания',
          isShowFiltr: true,
          filtr: ''
        },
        {
          id: 6,
          title: 'Показы',
          isShowFiltr: true,
          filtr: ''
        },
        {
          id: 7,
          title: '% Показов',
          isShowFiltr: true,
          filtr: ''
        },
        {
          id: 8,
          title: 'Клики',
          isShowFiltr: true,
          filtr: ''
        },
        {
          id: 9,
          title: 'Статус'
        },
      ],
      advertisementBody: [], /* Переменная, хранит в себе список реклам */
      search: '', /* Переменная, хранит в себе значение введенное в поле поиска */
      filter: '', /* Переменная, хранит в себе значение выбранного фильтра */
      meta: {}, /* Переменная, хранит в себе данные пагинации страницы */
      searchFilter: '', /* Переменная, хранит в себе ключ поиска фильтра */
      isLoading: true, /* Переменная, хранит в себе статус страницы */
      activeStatus: '', /* Активный статус */
    }
   },
  methods: {
    async get_advertisement(page = 1) { /* Get запрос реклам */
      this.isLoading = true /* Открываем загрузечное окно */
      this.advertisementBody = [] /* Очищаем список реклам */
      let res = await this.$axios.get(`advertisements${this.filter}?page=${page}`)
      this.isLoading = false /* Закрываем загрузечное окно */
      this.advertisementBody = res.data.data /* Записываем данные реклам в переменную */
      this.meta = res.data.meta /* Сохраняем meta данные пагинации */
    },
    async searchAdvertisement() {
      this.isLoading = true /* Открываем загрузочное окно */
      let start_sort = this.advertisementHead.filter((item) => item.title == 'Дата начала')[0].filtr
      let finish_sort = this.advertisementHead.filter((item) => item.title == 'Дата окончания')[0].filtr
      let view_sort = this.advertisementHead.filter((item) => item.title == 'Показы')[0].filtr
      let click_sort = this.advertisementHead.filter((item) => item.title == 'Клики')[0].filtr
      this.advertisementBody = [] /* Очищаем массив данных реклам */
      let res = await this.$axios.get(`/search/advertisements?${this.searchFilter}${this.activeStatus ? `status=${this.activeStatus}&`: ''}${start_sort ? `start_sort=${start_sort}&`: ''}${finish_sort ? `finish_sort=${finish_sort}&`: ''}${view_sort ? `view_sort=${view_sort}&`: ''}${click_sort ? `click_sort=${click_sort}&`: ''}keyword=${this.search}`) /* Делаем сам запрос */
      this.isLoading = false /* Закрываем загрузечное окно */
      this.advertisementBody = res.data.data /* Сохраняем данные реклам */
      this.meta.last_page = 0 /* Делаем число последней страницы 0 чтобы скрыть пагинацию */
    },
    checkPermission(name) {
      for (let i = 0; i < this.permissions.length; i++) {
        if (this.permissions[i].name === name) {
          return true;
        }
      }
      return false;
    },
    changeStatus(status) {
      this.activeStatus = status
      this.searchAdvertisement()
    },
    clickFiltr(item) { /* Фукнция клика по фильтру таблицы */
      if(item.filtr == 'asc') {
        item.filtr = 'desc'
      } else item.filtr = 'asc'
      this.searchAdvertisement() /* Делаем поиск */
    }
  },
  beforeMount() {
    if(!this.checkPermission('read-advertising')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.get_advertisement()
  },
};
</script>
