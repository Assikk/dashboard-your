<template>
  <div class="mb-10">
    <div class="flex items-center gap-4 justify-between mb-4">
      <h1 class="font-bold text-2xl">
        Спецпроекты
      </h1>
      <Button v-if="isShowAddButton" @click="$router.push('/special-projects/add')">
        Добавить
      </Button>
    </div>
    <div class="bg-white py-4 rounded-lg">
      <div class="px-4 flex gap-4 mb-4">
        <Search class="w-full" placeholder="Поиск спецпроектов по заголовку"
        v-model="search"
        @input="searchProject"
        @search="searchProject"/>
        <Select class="w-52" :list="$store.state.statusList" textList="title" valueList="value" active="Статус" id="status"/>
        <Select class="w-24" :list="$store.state.langList" textList="text" valueList="code" active="Язык" id="lang"/>
      </div>
      <Loading v-if="isLoading" />
      <Table v-if="!isLoading" class="min-h-[103px]" :head="projectsHead">
        <template #body>
          <tr v-for="(item, index) in projectsBody" :key="index">
            <td class="w-[88px]">
              <img class="w-10 h-10 rounded-md" width="40" height="40" :src="item.special_project.image" alt="Фото Спец проекта">
            </td>
            <td class="w-1/2 font-medium">
              <span class="special_project-name">
                {{item.special_project.name}}
              </span>
            </td>
            <td>
              <span>
                {{item.special_project.lang}}
              </span>
            </td>
            <td>
              <span>
                {{item.special_project.click_count}}
              </span>
            </td>
            <td>
              <p class="w-[105px] rounded-[10px] font-medium text-xs py-1 text-center"
              :class="(item.special_project.status == 'Одобрено' || item.special_project.status == 'Активный') ? 'bg-[#D1FAE5] text-[#065F46]' : (item.special_project.status == 'Отказано' || item.special_project.status == 'Удалено') ? 'bg-[#FEE2E2] text-[#991B1B]' : (item.special_project.status == 'На модерации') ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#F3F4F6] text-[#1F2937]'">
                {{item.special_project.status}}
              </p>
            </td>
            <td v-if="isShowEditIcon" class="w-16"
            @click="$router.push(`/special-projects/edit/${item.special_project.id}`)">
              <svg width="20" height="20" fill="black" class="edit-icon">
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
      @click="(page) => getProjects(page)"/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Button from "@/components/buttons/default.vue";
import Search from '@/components/inputs/search.vue'
import Pagination from '@/components/pagination.vue'
import Table from '@/components/table.vue'
import Loading from '@/components/loading/table.vue'
import Select from '@/components/selects/default.vue'
export default {
  name: "projectsPage",
  head: {
    title: 'Спецпроекты'
  },
  components: {
    Button,
    Search,
    Pagination,
    Table,
    Loading,
    Select
  },
  computed: {
    ...mapState({
      language: state => state.language.language,
      permissions: state => state.permissions
    }),
    isShowAddButton() {
      if(this.checkPermission('create-special_projects')) {
        return true
      } else false
    },
    isShowEditIcon() {
      if(this.checkPermission('update-special_projects')) {
        return true
      } else false
    }
  },
  data() {
    return {
      projectsHead: [ /* Переменная, хранит в себе данные шапки таблицы */
        {
          id: 1,
          title: 'Фото',
        },
        {
          id: 2,
          title: 'Заголовок'
        },
        {
          id: 3,
          title: 'Язык'
        },
        {
          id: 4,
          title: 'Просмотры',
          isShowFiltr: true,
          filtr: ''
        },
        {
          id: 5,
          title: 'Статус'
        },
      ],
      projectsBody: [], /* Переменная, хранит в себе список проектов */
      search: '', /* Переменная, хранит в себе значение введенное в поле поиска */
      meta: {}, /* Переменная, хранит в себе данные пагинации страницы */
      searchFilter: '', /* Переменная, хранит в себе ключ поиска фильтра */
      filter: '', /* Переменная, хранит в себе значение выбранного фильтра */
      isLoading: true /* Переменная, хранит в себе статус страницы */
    };
  },
  methods: {
    async searchProject() { /* Функция поиска афишы */
      if(this.search.length > 2) {
        this.isLoading = true /* Открываем загрузочное окно */
        this.projectsBody = [] /* Очищаем массив данных спецпроектов */
        let res = await this.$axios.get(`/search/special-projects?${this.searchFilter}${this.language ? `lang=${this.language}` : ''}&keyword=${this.search}`) /* Делаем сам запрос */
        this.isLoading = false /* Закрываем загрузечное окно */
        this.projectsBody = res.data.data /* Записываем данные спецпроектов в переменную */
        this.meta.last_page = 0 /* Делаем число последней страницы 0 чтобы скрыть пагинацию */
      }
      if(this.search.length == 0) {
        this.getProjects()
      }
    },
    async getProjects(page = 1) { /* Get запрос афиш */
      this.isLoading = true /* Открываем загрузечное окно */
      this.postersBody = [] /* Очищаем список афиш */
      let res = await this.$axios.get(`/special-projects${this.filter}?page=${page}&lang=${this.language}`) /* Сам запрос */
      this.isLoading = false /* Закрываем загрузечное окно */
      this.projectsBody = res.data.data /* Записываем данные в переменную */
      this.meta = res.data.meta /* Сохраняем meta данные пагинации */
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
    if(!this.checkPermission('read-special_projects')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.getProjects()
  },
  watch: {
    language() { /* При изменении языка делаем get запрос афиш с актуальным языком */
      if(this.search.length > 2) {
        this.searchProject()
      }
      if(this.search.length == 0) {
        this.getProjects()
      }
    }
  }
};
</script>
<style scoped>
.special_project-name {
  overflow: hidden;
	text-overflow: ellipsis;
  display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
</style>
