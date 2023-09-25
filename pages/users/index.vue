<template>
  <div>
    <div class="flex justify-between mb-4">
      <p class="font-bold text-2xl">
        Пользователи
      </p>
      <Button v-if="isShowAddButton" @click="$router.push('/users/add')">
        Добавить
      </Button>
    </div>
    <div class="bg-white pt-4 rounded-lg">
      <Search class="mb-4 mx-4" placeholder="Поиск пользователя"
      v-model="search"
      @input="searchUsers"
      @search="searchUsers"/>
      <Loading v-if="isLoading" />
      <Table v-if="!isLoading" class="min-h-[103px]" :head="usersHead">
        <template #body>
          <tr v-for="(user, index) in usersBody" :key="index">
            <td>
              <span>
                  {{user.first_name}} {{user.last_name}}
              </span>
            </td>
            <td>
              <span>
                {{user.email}}
              </span>
            </td>
            <td>
              <span>
                {{user.role.name}}
              </span>
            </td>
            <td>
              <span>
                0
              </span>
            </td>
            <td>
              <p class="rounded-[10px] w-[102px] py-[2px] text-center text-xs font-medium"
              :class="user.status.id == 1 ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#D1FAE5] text-[#065F46]'">
                {{user.status.name}}
              </p>
            </td>
            <td v-if="isShowEditIcon" class="w-16"
            @click="$router.push(`/users/edit/${user.id}`)">
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
      @click="(page) => getUsers(page)"/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Button from '@/components/buttons/default.vue'
import Search from '@/components/inputs/search.vue'
import Table from '@/components/table.vue'
import Pagination from '@/components/pagination.vue'
import Loading from '@/components/loading/table.vue'
export default {
  name: "Users",
  components: {Search, Button, Table, Pagination, Loading },
  head: {
    title: 'Пользователи'
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
    isShowAddButton() {
      if(this.checkPermission('create-users')) {
        return true
      } else false
    },
    isShowEditIcon() {
      if(this.checkPermission('update-users')) {
        return true
      } else false
    }
  },
  data() {
    return {
      usersHead: [ /* Переменная, хранит в себе данные шапки таблицы */
        {
          id: 1,
          title: 'Пользователь',
        },
        {
          id: 2,
          title: 'Эл. почта'
        },
        {
          id: 3,
          title: 'Роль'
        },
        {
          id: 4,
          title: 'Записи'
        },
        {
          id: 5,
          title: 'Статус'
        },
      ],
      usersBody: [], /* Переменная, хранит в себе данные всех пользователей */
      meta: {}, /* Переменная, хранит в себе данные пагинации страницы */
      search: '', /* Переменная, хранит в себе значение введенное в поле поиска */
      isLoading: true /* Переменная, хранит в себе статус страницы */
    }
  },
  methods: {
    async getUsers(page = 1) { /* Get запрос всех пользователей */
      this.isLoading = true /* Открываем загрузечное окно */
      this.usersBody = [] /* Очищаем массив данных пользователей */
      let res = await this.$axios.get(`/users?page=${page}&keyword=${this.search}`) /* Делаем сам запрос */
      this.isLoading = false /* Закрываем загрузечное окно */
      this.usersBody = res.data.data /* Сохраняем данные пользователей */
      this.meta = res.data.meta /* Сохраняем meta данные пагинации */
    },
    async searchUsers() { /* Функция поиска пользователей */
      if(this.search.length > 2 || this.search.length == 0) {
        this.isLoading = true /* Открываем загрузочное окно */
        this.usersBody = [] /* Очищаем массив данных пользователей */
        let res = await this.$axios.get(`/search/users?keyword=${this.search}`) /* Делаем сам запрос */
        this.isLoading = false /* Закрываем загрузечное окно */
        this.usersBody = res.data.data /* Сохраняем данные пользователей */
        this.meta.last_page = 0 /* Делаем число последней страницы 0 чтобы скрыть пагинацию */
      }
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
    if(!this.checkPermission('read-users')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.getUsers()
  }
};
</script>
