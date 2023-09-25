<template>
  <div>
    <!-- Начало заголовка -->
    <h1 class="font-bold text-2xl">
      Изменение публикации
    </h1>
    <!-- Конец заголовка -->
    <div v-if="publication" class="bg-white mt-4 p-4 rounded-lg">
      <div class="flex flex-col gap-6">
        <div>
          <p class="mb-1">
            Изображение
          </p>
          <div class="flex items-center gap-4">
            <img :src="publication.image" alt="Poster Image" width="80" height="80" class="w-[80px] h-[80px]">
            <Button outlined
            @click="showModalMediaFiles">
              Изменить фото
            </Button>
          </div>
        </div>

        <!-- Поле ввода заголовка -->
        <Input @blur="publication.slug = `http://your.colibri.tj/${language}/publication/${publication.title}`" v-model="publication.title" label="Заголовок" placeholder="Введите заголовок"
        :error="$v.publication.title.$dirty && !$v.publication.title.required">
          <template #error>
            <span v-if="$v.publication.title.$dirty && !$v.publication.title.required">
              Введите заголовок
            </span>
          </template>
        </Input>

        <!-- Поле ввода подзаголовка -->
        <Input v-model="publication.subtitle" label="Подзаголовок (Описание)" placeholder="Введите подзаголовок"
        :error="$v.publication.subtitle.$dirty && !$v.publication.subtitle.required">
          <template #error>
            <span v-if="$v.publication.subtitle.$dirty && !$v.publication.subtitle.required">
              Введите подзаголовок
            </span>
          </template>
        </Input>

        <!-- Поле выбора рубрики -->
        <Select full active="Выберите рубрику" v-model="publication.heading.id" id="heading" iconLocation="99" label="Рубрики" :list="categoriesList" textList="title" valueList="value"/>

        <!-- Поле выбора тегов -->
        <MultiSelect placeholder="Выберите теги" multi v-model="publication.tags" label="Теги" :list="tagsList" textList="name" valueList="id">
        </MultiSelect>

        <!-- Поле выбора расположения на сайте -->
        <div class="flex justify-between items-end gap-4">
          <p>Расположение: {{publication.site_location}}</p>
          <Button @click="showLocationModal">
            Изменить расположение
          </Button>
        </div>


        <!-- Поле ввода ссылки на публикацию -->
        <Input v-model="publication.slug" disabled label="Ссылка"/>

        <!-- Поле ввода описания -->
        <div class="flex flex-col gap-2">
          <p class="font-medium text-gray-700">
            Описание
          </p>
          <VueEditor v-model="publication.content" />
        </div>

        <!-- Начало блока кнопок -->
        <div class="flex gap-5">
          <Button :disabled="disabledSave" @click="editPublication">
            Сохранить
          </Button>
          <Button warning :disabled="disabledDelete" @click="deletePublication">
            Удалить
          </Button>
          <Button gray
          @click="$router.push('/publications')">
            Отменить
          </Button>
        </div>
        <!-- Конец блока кнопок -->
      </div>
    </div>
    <transition-group name="fade">
      <MediaFiles v-if="isShowMediaFiles"
      key="mediaFiles"
      @save="saveFile"/>
      <LocationModal
      key="location"
      v-if="isShowLocation"
      @clickLocation="(id) => publication.site_location = id"/>
    </transition-group>
  </div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import {required} from 'vuelidate/lib/validators'
import Lang from '@/components/lang'
import Button from '@/components/buttons/default.vue'
import MediaFiles from '@/components/modals/media-files.vue'
import Input from '@/components/inputs/default.vue'
import Select from '@/components/selects/default.vue'
import MultiSelect from '@/components/selects/primary.vue'
import LocationModal from '@/components/modals/location.vue'
export default {
  name: 'EditPublicationPage',
  head: {
    title: 'Изменение публикации'
  },
  components: {
    Lang,
    Button,
    MediaFiles,
    Input,
    Select,
    MultiSelect,
    LocationModal
  },
  computed: {
    ...mapState({
      language: state => state.language.language,
      isShowMediaFiles: state => state.isShowMediaFiles,
      isShowLocation: state => state.isShowLocation
    }),
  },
  data() {
    return {
      publication: null,
      nameImage: '', /* Переменная хранит в себе название загруженного фото, чтобы в дальнейшем отобразить */
      categoriesList: [ /* Списк рубрик */
        {
          id: 1,
          title: 'Новости',
          value: 1
        },
        {
          id: 2,
          title: 'Истории',
          value: 2
        },
        {
          id: 3,
          title: 'Подкасты',
          value: 3
        },
      ],
      tagsList: [], /* Список тегов */
      locationList: [
        {
          id: 1,
          name: 'A1'
        },
        {
          id: 2,
          name: 'A2'
        },
        {
          id: 3,
          name: 'A3'
        },
        {
          id: 4,
          name: 'A4'
        },
        {
          id: 5,
          name: 'A5'
        },
      ],
      disabledSave: false, /* Переменная отвечает за статус кнопки сохранения */
      disabledDelete: false, /* Переменная отвечает за статус кнопки удаления */
    }
  },
  validations: {
    publication: {
      image: {required},
      title: {required},
      subtitle: {required},
      site_location: {required}
    }
  },
  methods: {
    ...mapMutations({
      loading_alert: 'alert/LOADING_ALERT',
      change_state: 'CHANGE_STATE'
    }),
    ...mapActions({
      success_alert: 'alert/success_alert',
      error_alert: 'alert/error_alert'
    }),
    showModalMediaFiles() {
      let payload = {
        key: 'isShowMediaFiles',
        body: true
      }
      this.change_state(payload)
    },
    saveFile(file) {
      this.publication.image = file.file
      this.nameImage = file.name
    },
    async editPublication() {
      if(this.$v.$invalid) {
        this.$v.$touch()
        this.error_alert('Форма заполнена неправильно') /* Открываем ошибочное модальное окно */
        return
      }
      if(!this.disabledSave) { /* Делаем запрос когда кнопка активна */
        this.publication.status = 'Активный'
        this.publication.slug = this.publication.title
        try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.put(`/posts/${this.publication.id}`, this.publication)
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/publications') /* Направляем на страницу публикаций */
        } catch(err) {
          this.disabledSave = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    },
    async getTags() {
      let res = await this.$axios.get('/tags')
      this.tagsList = res.data.data
    },
    showLocationModal() {
      let payload = {
        key: 'isShowLocation',
        body: true
      }
      this.change_state(payload)
    },
    async getPublication() {
      let res = await this.$axios.get(`/posts/${this.$route.params.slug}`)
      this.publication = res.data.data
    },
    async deletePublication() {
      if(this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if(!this.disabledDelete) { /* Делаем запрос когда кнопка активна */
        this.publication.status = 'Удалено'
        this.disabledDelete = true /* Делаем после клика кнопку неактивной */
        try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.put(`/posts/${this.publication.id}`, this.publication) /* Запрос добавления */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/publications') /* Направляем на страницу публикаций */
        } catch(err) {
          this.disabledDelete = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    }
  },
  async mounted() {
    await this.getPublication()
    await this.getTags()
  }
}
</script>
