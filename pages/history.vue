<template>
  <div class="mb-10">
    <h1 class="font-bold text-2xl">
      История
    </h1>
    <FilterHistory :filter="filterList" :lang="false"
    @click="clickFilter"/>
    <div class="bg-white pt-4 rounded-lg"
    :class="meta.last_page > 1 ? 'pb-4' : 'pb-0'">
      <Search class="mb-4" placeholder="Поиск истории"
      v-model="search"
      @input="searchHistory"
      @search="searchHistory"/>
      <Loading v-if="isLoading" />
      <Table v-if="!isLoading" class="min-h-[103px]" :head="historyHead">
        <template #body>
          <tr v-for="(item, index) in historyBody" :key="index">
            <td>
              <span>
                {{item.first_name}}
              </span>
            </td>
            <td class="w-1/2">
              <span>
                {{item.description}}
              </span>
            </td>
            <td>
              <span>
                {{item.role}}
              </span>
            </td>
            <td>
              <span>
                {{item.created_at}}
              </span>
            </td>
          </tr>
        </template>
      </Table>
      <Pagination
      v-if="meta.last_page > 1"
      v-model="pagePagination"
      :lastPage="meta.last_page"
      :total="meta.total"
      :to="meta.to"
      @click="(page) => changePagination(page)"/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import FilterHistory from '@/components/filterTable.vue'
import Search from '@/components/inputs/search.vue'
import Loading from '@/components/loading/table.vue'
import moment from 'moment'
export default {
  name: "hisroryPage",
  components: {
    FilterHistory,
    Search,
    Loading
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
  },
  data() {
    return {
      filterList: [ /* Переменная, хранит в себе список фильтра */
        {
          id: 1,
          text: "Все",
          count: "0",
          code: '',
          search: '',
          role: ''
        },
        {
          id: 2,
          text: "Редактор",
          count: "0",
          code: 'my',
          search: 'user=me',
          role: 'role=Редактор&'
        },
        {
          id: 3,
          text: "Автор",
          count: "0",
          code: 'active',
          search: 'status=Актвный',
          role: 'role=Автор&'
        },
        {
          id: 4,
          text: "Мои",
          count: "0",
          code: 'inactive',
          search: 'status=Неактивный',
          role: 'user=me&'
        },
        {
          id: 5,
          text: "Администратор",
          count: "0",
          code: 'deleted',
          search: 'status=Удалено',
          role: 'role=Администратор&'
        },
      ],
      historyHead: [
        {
          id: 1,
          title: 'Пользователь',
        },
        {
          id: 2,
          title: 'Действие'
        },
        {
          id: 3,
          title: 'Роль'
        },
        {
          id: 5,
          title: 'Дата'
        },
      ],
      historyBody: [],
      search: '', /* Переменная, хранит в себе значение введенное в поле поиска */
      isLoading: true, /* Переменная, хранит в себе статус страницы */
      meta: {}, /* Переменная, хранит в себе данные пагинации страницы */
      filter: '', /* Переменная, хранит в себе значение выбранного фильтра */
      searchFilter: '', /* Переменная, хранит в себе ключ поиска фильтра */
      pagePagination: 1
    }
  },
  methods: {
    clickFilter(val) {
      this.pagePagination = 1
      this.filter = val.role
      this.searchHistory()
    },
    async searchHistory() {
      this.isLoading = true /* Открываем загрузочное окно */
      this.historyBody = [] /* Очищаем массив данных историй */
      let res = await this.$axios.get(`/search/user-log?page=${this.pagePagination}&${this.filter}keyword=${this.search}`) /* Делаем сам запрос */
      this.isLoading = false /* Закрываем загрузечное окно */
      this.historyBody = res.data.data /* Сохраняем данные историй */
      this.historyBody.forEach((item) => { /* Меняем форматы даты на ГГГГ-ММ-ДД ЧЧ:ММ:СС */
        item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
      })
      this.meta = res.data.meta /* Сохраняем meta данные пагинации */
    },
    async getHistory() {
      this.isLoading = true /* Открываем загрузечное окно */
      this.historyBody = [] /* Очищаем список историй */
      let res = await this.$axios.get(`/user-logs?${this.filter}page=${this.pagePagination}`) /* Сам запрос */
      this.isLoading = false /* Закрываем загрузечное окно */
      this.historyBody = res.data.data /* Записываем данные исотрий в переменную */
      this.historyBody.forEach((item) => { /* Меняем форматы даты на ГГГГ-ММ-ДД ЧЧ:ММ:СС */
        item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
      })
      this.meta = res.data.meta /* Сохраняем meta данные пагинации */
    },
    async get_counter() { /* Get запрос счетчика фильтра */
      let res = await this.$axios.get(`/user-logs/count/${this.$store.state.auth.user.id}`)
      this.filterList.forEach(list => { /* Перебор чтобы записать данные счетчика */
        for (let key in res.data) {
          if(list.text == key) {
            list.count = res.data[key]
          }
        }
      })
    },
    changePagination(page) {
      this.pagePagination = page
      if(this.search.length == 0) {
        this.getHistory()
      } else this.searchHistory()
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
    if(!this.checkPermission('read-logs')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.getHistory()
    this.get_counter()
  }
};
</script>
