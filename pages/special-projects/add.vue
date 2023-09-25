<template>
  <div>
    <!-- Начало заголовка -->
    <p class="font-bold text-2xl">
      Добавление спецпроекта
    </p>
    <!-- Конец заголовка -->
    <div class="bg-white mt-4 p-4">
      <!-- Компонент переключения языка -->
      <Lang  @change="clearProject"/>
      <div class="my-8">
        <!-- Начало блока выбора фото -->
        <div class="w-fit mt-4 flex flex-col mb-6">
          <p class="mb-1">
            Изображение
          </p>
          <!-- Блок отображается когда фото не выбрано -->
          <AddFile v-if="!project.image" id="photoByPoster" @upload="uploadImageProject">
            <div class="py-2 w-fit px-3 rounded-md bg-white font-medium text-white shadow-sm text-center cursor-pointer border border-[#0048B7] text-[#0048B7]">
              Добавить медиафайл
            </div>
          </AddFile>
          <!-- Блок отображается с загруженным фото -->
          <div v-else class="flex items-center gap-1">
            <div class="rounded-md border border-[#D1D5DB] flex items-center gap-2.5 pr-2.5">
              <img :src="project.image" alt="Poster Image" width="40" height="40" class="w-10 h-10">
              <p class="text-sm">
                {{nameImage}}
              </p>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#9CA3AF" class="cursor-pointer"
            @click="project.image = ''">
              <use xlink:href="#close"/>
            </svg>
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

        <!-- Начало блока кнопок -->
        <div class="mt-6 flex gap-5">
          <Button :disabled="disabledSave" @click="addProject">
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
import Lang from '@/components/lang'
import Input from '@/components/inputs/default.vue'
import Button from '@/components/buttons/default.vue'
import {ToggleButton} from 'vue-js-toggle-button'
import AddFile from '@/components/AddFile.vue'
export default {
  name: "AddProject",
  components: {
    Lang, Input, Button, ToggleButton, AddFile
  },
  data() {
    return {
      project: {
        name: '',
        image: '',
        link: '',
        status: 'На модерации',
        lang: this.$store.state.language.language,
        user_id: this.$store.state.auth.user.id
      },
      nameImage: '', /* Переменная хранит в себе название загруженного фото, чтобы в дальнейшем отобразить */
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
    async addProject() { /* Функция добавления новой афишы */
      if(this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if(!this.disabledSave) { /* Делаем запрос когда кнопка активна */
        this.disabledSave = true /* Делаем после клика кнопку неактивной */
      try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.post('/special-projects', this.project) /* Запрос добавления */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/special-projects') /* Направляем на страницу афиш */
        } catch(err) {
          this.disabledSave = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    },
    uploadImageProject(image) { /* Функция добавления фото постера */
      this.project.image = image.file /* Присваиваем файл в переменную */
      this.nameImage = image.name /* Присваиваем имя файла в переменную */
    },
    clearProject() { /* Функция очищает форму и возвращает в изначальное состояние */
      this.project = {
        name: '',
        image: '',
        link: '',
        status: 'На модерации',
        lang: this.$store.state.language.language,
        user_id: this.$store.state.auth.user.id
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
    if(!this.checkPermission('create-special_projects')) {
      this.$router.back(-1)
    }
  },
};
</script>
