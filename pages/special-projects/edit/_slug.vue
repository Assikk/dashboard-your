<template>
  <div>
    <!-- Начало заголовка -->
    <p class="font-bold text-2xl">
      Изменение спецпроекта
    </p>
    <!-- Конец заголовка -->
    <div class="bg-white mt-4 p-4">
      <div class="my-8">
        <!-- Начало блока выбора фото -->
        <div class="mt-4 flex flex-col mb-6">
          <p class="mb-1">
            Изображение
          </p>
          <!-- Блок отображается И изменения фото -->
          <div class="flex items-center gap-4">
            <img :src="project.image" alt="Poster Image" width="80" height="80" class="w-[80px] h-[80px]">
            <AddFile id="photoByPoster" @upload="(image) => project.image = image.file">
            <div class="py-2 w-fit px-3 rounded-md bg-white font-medium text-white shadow-sm text-center cursor-pointer border border-[#0048B7] text-[#0048B7]">
              Изменить фото
            </div>
          </AddFile>
          </div>
          <p class="text-sm text-[#ff0000] mt-1"
          v-if="$v.project.image.$dirty && !$v.project.image.required">
            Выберите фото
          </p>
        </div>
        <!-- Конец блока выбора фото -->

        <!-- Поле ввода заголовка -->
        <Input v-model="project.name" label="Заголовок" placeholder="Введите заголовок"
        :error="$v.project.name.$dirty && !$v.project.name.required">
          <template #error>
            <span v-if="$v.project.name.$dirty && !$v.project.name.required">
              Введите заголовок
            </span>
          </template>
        </Input>

        <!-- Поле ввода ссылки на сайт -->
        <Input class="mt-4" v-model="project.link" label="Ссылка на сайт" placeholder="Введите ссылку"
        :error="$v.project.link.$dirty && !$v.project.link.required || $v.project.link.$dirty && !$v.project.link.url">
          <template #error>
            <span v-if="$v.project.link.$dirty && !$v.project.link.required">
              Введите ссылку
            </span>
            <span v-if="$v.project.link.$dirty && !$v.project.link.url">
              Введите корректную ссылку
            </span>
          </template>
        </Input>

        <!-- Поле ввода выбора статуса -->
        <Select label="Статус" :list="$store.state.statusList" textList="title" valueList="value" v-model="project.status" class="mt-6"/>

        <!-- Начало блока кнопок -->
        <div class="mt-6 flex gap-5">
          <Button :disabled="disabledSave" @click="editProject">
            Опубликовать
          </Button>
          <Button gray
          @click="$router.push('/special-projects')">
            Отменить
          </Button>
        </div>
        <!-- Конец блока кнопок -->
      </div>
    </div>
  </div>
</template>

<script>
import {required, url} from 'vuelidate/lib/validators'
import {mapState, mapMutations, mapActions} from 'vuex'
import Input from '@/components/inputs/default.vue'
import Button from '@/components/buttons/default.vue'
import {ToggleButton} from 'vue-js-toggle-button'
import AddFile from '@/components/AddFile.vue'
export default {
  name: "AddPost",
  components: {
    Input, Button, ToggleButton, AddFile
  },
  data() {
    return {
      project: {},
      disabledSave: false
    }
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
  },
  validations: {
    project: {
      image: {required},
      name: {required},
      link: {required, url}
    }
  },
  methods: {
    ...mapMutations({
      loading_alert: 'alert/LOADING_ALERT'
    }),
    ...mapActions({
      success_alert: 'alert/success_alert',
      error_alert: 'alert/error_alert'
    }),
    async editProject() { /* Функция изменения проекта */
      if(this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if(!this.disabledSave) { /* Делаем запрос когда кнопка активна */
        this.disabledSave = true /* Делаем после клика кнопку неактивной */
      try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.put(`/special-projects/${this.project.id}`, this.project) /* Запрос добавления */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/special-projects') /* Направляем на страницу афиш */
        } catch(err) {
          this.disabledSave = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    },
    async get_project() {
      try {
        let res = await this.$axios.get(`/special-projects/${this.$route.params.slug}`);
        this.project = res.data.data.special_project
      } catch(err) {
        console.log(err);
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
    if(!this.checkPermission('update-special_projects')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.get_project()
  }
};
</script>
