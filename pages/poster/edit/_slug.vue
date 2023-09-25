<template>
  <div>
    <!-- Начало заголовка -->
    <p class="font-bold text-2xl">
      Изменение афиши
    </p>
    <!-- Конец заголовка -->
    <div class="bg-white mt-4 p-4">
      <div class="my-8">
        <div class="flex flex-wrap lg:flex-nowrap items-center gap-4 justify-between">
          <!-- Начало блока выбора дат -->
          <div class="flex items-center gap-5">
            <div class="h-[90px] flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-2">
                Дата и время (Начало)
              </label>
              <div class="border w-fit rounded-md"
              :class="($v.poster.start.$dirty && !$v.poster.start.required) || ($v.poster.start.$dirty && !$v.poster.start.minDate) ? 'border-[#ff0000]' : 'border-gray-300'">
                <DatePick
                v-model="poster.start"
                :pickTime="true"
                :format="'YYYY-MM-DD HH:mm'" />
              </div>
              <span class="text-sm text-[#ff0000] mt-1"
              v-if="$v.poster.start.$dirty && !$v.poster.start.required">
                Выберите дату
              </span>
              <span class="text-sm text-[#ff0000] mt-1"
              v-else-if="$v.poster.start.$dirty && !$v.poster.start.minDate">
                Укажите будущую дату
              </span>
            </div>
            <div class="h-[90px] flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-2">
                Дата и время (Конец)
              </label>
              <div class="border w-fit rounded-md"
              :class="($v.poster.finish.$dirty && !$v.poster.finish.required) || ($v.poster.finish.$dirty && !$v.poster.finish.minDate) ? 'border-[#ff0000]' : 'border-gray-300'">
                <DatePick
                v-model="poster.finish"
                :pickTime="true"
                :format="'YYYY-MM-DD HH:mm'"/>
              </div>
              <span class="text-sm text-[#ff0000] mt-1"
              v-if="$v.poster.finish.$dirty && !$v.poster.finish.required">
                Выберите дату
              </span>
              <span class="text-sm text-[#ff0000] mt-1"
              v-else-if="$v.poster.finish.$dirty && !$v.poster.finish.minDate">
                Дата не должна быть раньше старта
              </span>
            </div>
            <Pin :active="Boolean(poster.priority)" @click="poster.priority = !poster.priority"/>
          </div>
          <!-- Конец блока выбора дат -->

          <!-- Начало блока выбора стоимости -->
          <div class="w-full lg:w-3/4 flex justify-start lg:justify-end">
            <div class="flex items-center gap-5">
              <div class="flex gap-3">
                <ToggleButton :value="Boolean(poster.free)" color="#0048B7" @change="changeTogglePrice" :height="24" :width="44"/>
                <p class="w-[90px] text-center text-sm font-medium">
                  {{poster.free ? 'Платно' : 'Бесплатно'}}
                </p>
              </div>
              <Input
              v-model="poster.cost"
              type="number"
              id="price"
              :disabled="poster.free ? false : true"/>
            </div>
          </div>
          <!-- Конец блока выбора стоимости -->
        </div>
        <!-- Начало блока выбора фото -->
        <div class="mt-4 flex flex-col mb-6">
          <p class="mb-1">
            Изображение
          </p>
          <!-- Блок отображается И изменения фото -->
          <div class="flex items-center gap-4">
            <img :src="poster.image" alt="Poster Image" width="80" height="80" class="w-[80px] h-[80px]">
            <Button outlined
            @click="showModalMediaFiles">
              Изменить фото
            </Button>
          </div>
          <p class="text-sm text-[#ff0000] mt-1"
          v-if="$v.poster.image.$dirty && !$v.poster.image.required">
            Выберите фото
          </p>
        </div>
        <!-- Конец блока выбора фото -->

        <!-- Поле ввода заголовка -->
        <Input @blur="poster.slug = `http://your.colibri.tj/${poster.lang}/poster/${poster.title}`" v-model="poster.title" label="Заголовок" placeholder="Введите заголовок"
        :error="$v.poster.title.$dirty && !$v.poster.title.required">
          <template #error>
            <span v-if="$v.poster.title.$dirty && !$v.poster.title.required">
              Введите заголовок
            </span>
          </template>
        </Input>

        <!-- Поле ввода адреса -->
        <Input v-model="poster.address" label="Адрес" placeholder="Введите адрес" class="my-6"
        :error="$v.poster.address.$dirty && !$v.poster.address.required">
          <template #error>
            <span v-if="$v.poster.address.$dirty && !$v.poster.address.required">
              Введите адрес
            </span>
          </template>
        </Input>

        <!-- Поле ввода Даты мероприятия -->
        <Input v-model="poster.event_date" label="Дата мероприятия"/>

        <!-- Поле ввода ссылки на афишу -->
        <Link class="my-6" v-model="poster.slug" label="Ссылка на афишу"/>

        <!-- Поле ввода описания -->
        <div class="flex flex-col gap-2">
          <p class="font-medium text-gray-700">
            Описание
          </p>
          <VueEditor v-model="poster.description" />
        </div>

        <!-- Начало блока кнопок -->
        <div class="mt-6 flex gap-5">
          <Button :disabled="disabledSave" @click="editPoster">
            Сохранить
          </Button>
          <Button warning :disabled="disabledDelete"
          @click="deletePoster">
            В корзину
          </Button>
          <Button gray
          @click="$router.push('/poster')">
            Отменить
          </Button>
        </div>
        <!-- Конец блока кнопок -->
      </div>
    </div>
    <transition name="fade">
      <MediaFiles v-if="isShowMediaFiles"
      @save="(file) => poster.image = file.file"/>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import {required} from 'vuelidate/lib/validators'
import {mapState, mapMutations, mapActions} from 'vuex'
import Lang from '@/components/lang'
import Input from '@/components/inputs/default.vue'
import Select from '@/components/selects/default.vue'
import Button from '@/components/buttons/default.vue'
import {ToggleButton} from 'vue-js-toggle-button'
import AddFile from '@/components/AddFile.vue'
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';
import MediaFiles from '@/components/modals/media-files.vue'
import Pin from '@/components/buttons/pin.vue'
import Link from '@/components/inputs/link.vue'
export default {
  name: "EditPost",
  head: {
    title: 'Редактирование афишы'
  },
  components: {
    Lang, Input, Button, ToggleButton, AddFile, Select, DatePick, MediaFiles, Pin, Link
  },
  data() {
    return {
      poster: {},
      disabledSave: false,
      disabledDelete: false
    }
  },
  computed: {
    today() { /* Переменная, хранит в себе сегодняшнюю дату в формате ГГГГ-ММ-ДД */
      return new moment().format('YYYY-MM-DD')
    },
    ...mapState({
      permissions: state => state.permissions,
      isShowMediaFiles: state => state.isShowMediaFiles
    }),
  },
  validations: {
    poster: {
      start: {required,
      minDate: val => new Date(val) >= new Date()},
      finish: {required,
      minDate: function (val) {
        return new Date(val) >= new Date(this.poster.start)
      }},
      image: {required},
      title: {required},
      address: {required},
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
    async deletePoster() {
      this.poster.status = 'Удалено'
      if(this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if(!this.disabledDelete) { /* Делаем запрос когда кнопка активна */
        this.disabledDelete = true /* Делаем после клика кнопку неактивной */
        this.poster.cost = String(this.poster.cost)
      try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.put(`/posters/${this.poster.id}`, this.poster) /* Запрос добавления */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/poster') /* Направляем на страницу афиш */
        } catch(err) {
          this.disabledDelete = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    },
    async editPoster() { /* Функция добавления новой афишы */
      this.poster.status = 'Активный'
      if(this.$v.$invalid) {
        this.$v.$touch()
        this.error_alert('Форма заполнена неправильно') /* Открываем ошибочное модальное окно */
        return
      }
      if(!this.disabledSave) { /* Делаем запрос когда кнопка активна */
        this.disabledSave = true /* Делаем после клика кнопку неактивной */
        this.poster.cost = String(this.poster.cost)
        this.poster.slug = this.poster.title
      try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.put(`/posters/${this.poster.id}`, this.poster) /* Запрос добавления */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/poster') /* Направляем на страницу афиш */
        } catch(err) {
          this.disabledSave = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    },
    changeTogglePrice(value) { /*Функция меняющая toggle стоимости */
      this.poster.free = value.value /* Присваиваем boolean значение в переменную */
    },
    async get_poster() { /* Get Функция текущей афишы  */
      try {
        let res = await this.$axios.get(`/posters/${this.$route.params.slug}`);
        this.poster = res.data.data.poster
        this.poster.slug = `http://your.colibri.tj/${this.poster.lang}/poster/${this.poster.slug}`
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
    if(!this.checkPermission('update-posters')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.get_poster()
  }
};
</script>
<style scoped>
::v-deep .vdpComponent > input {
  outline: none;
  padding: 8px 12px;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
