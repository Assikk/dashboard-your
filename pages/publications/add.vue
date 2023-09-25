<template>
  <div>
    <!-- Начало заголовка -->
    <h1 class="font-bold text-2xl">
      Добавление публикации
    </h1>
    <!-- Конец заголовка -->
    <div class="bg-white mt-4 p-4 rounded-lg">
      <Lang @change="clearPublication"/>
      <div class="mt-8 flex flex-col gap-6">
        <div>
          <p class="mb-1">
            Изображение
          </p>
          <!-- Блок отображается когда фото не выбрано -->
          <Button outlined v-if="!publication.image"
          @click="showModalMediaFiles">
            Добавить медиафайл
          </Button>
          <!-- Блок отображается с загруженным фото -->
          <div v-else class="flex items-center gap-1">
            <div class="rounded-md border border-[#D1D5DB] flex items-center gap-2.5 pr-2.5">
              <img :src="publication.image" alt="Poster Image" width="40" height="40" class="w-10 h-10">
              <p class="text-sm">
                {{nameImage}}
              </p>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#9CA3AF" class="cursor-pointer"
            @click="publication.image = ''">
              <use xlink:href="#close"/>
            </svg>
          </div>
          <p class="text-sm text-[#ff0000] mt-1"
          v-if="$v.publication.image.$dirty && !$v.publication.image.required">
            Выберите фото
          </p>
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
        <Select full active="Выберите рубрику" v-model="publication.heading_id" id="heading" iconLocation="99" label="Рубрики" :list="categoriesList" textList="title" valueList="value"
        :error="$v.publication.heading_id.$dirty && !$v.publication.heading_id.required">
          <template #error>
            <span v-if="$v.publication.heading_id.$dirty && !$v.publication.heading_id.required">
              Введите рубрику
            </span>
          </template>
        </Select>

        <!-- Поле выбора тегов -->
        <MultiSelect placeholder="Выберите теги" multi v-model="publication.tags" label="Теги" :list="tagsList" textList="name" valueList="id">
        </MultiSelect>

        <!-- Поле выбора расположения на сайте -->
        <div>
          <div class="flex justify-between items-end gap-4" v-if="publication.site_location">
            <p>Расположение: {{publication.site_location}}</p>
            <Button @click="showLocationModal">
              Изменить расположение
            </Button>
          </div>
          <div v-else class="flex items-end gap-4">
            <Button @click="showLocationModal">
              Выбрать расположение
            </Button>
            <p class="text-sm text-[#ff0000]"
            v-if="$v.publication.site_location.$dirty && !$v.publication.site_location.required">
              Выберите расположение медиафайла
            </p>
          </div>
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
          <Button :disabled="disabledSave" @click="addPublication">
            Опубликовать
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
  name: 'AddPublicationPage',
  head: {
    title: 'Добавление публикации'
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
      publication: {
        image: '',
        title: '',
        subtitle: '',
        heading_id: null,
        tags: [],
        site_location: null,
        slug: '',
        content: '',
        status: 'На модерации',
        lang: '',
        user_id: this.$store.state.auth.user.id
      },
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
      disabledSave: false
    }
  },
  validations: {
    publication: {
      image: {required},
      title: {required},
      subtitle: {required},
      heading_id: {required},
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
    async addPublication() {
      if(this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if(!this.disabledSave) { /* Делаем запрос когда кнопка активна */
        this.publication.slug = this.publication.title
        this.publication.lang = this.$store.state.language.language
        try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.post('/posts', this.publication)
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/publications') /* Направляем на страницу афиш */
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
    clearPublication(lang) {
      this.$v.$reset()
      this.publication = {
        image: '',
        title: '',
        subtitle: '',
        heading_id: null,
        tags: [],
        site_location: null,
        slug: '',
        content: '',
        status: 'На модерации',
        lang: '',
        user_id: this.$store.state.auth.user.id
      }
    },
    showLocationModal() {
      let payload = {
        key: 'isShowLocation',
        body: true
      }
      this.change_state(payload)
    },
  },
  mounted() {
    this.getTags()
  }
}
</script>
