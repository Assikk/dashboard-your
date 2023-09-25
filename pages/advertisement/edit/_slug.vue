<template>
  <div>
    <!-- Начало заголовка -->
    <p class="font-bold text-2xl">
      Изменение рекламы
    </p>
    <!-- Конец заголовка -->

    <div class="bg-white mt-4 p-4">
      <div class="w-4/5">
        <!-- Начало блока выбора дат -->
        <div class="flex flex-col gap-6">
          <div class="w-1/4 flex items-center gap-5">
            <div class="h-[90px] flex flex-col">
              <label class="font-medium text-gray-700 mb-2">
                Дата и время (Начало)
              </label>
              <div class="border w-fit rounded-md"
              :class="$v.advertisement.start.$dirty && !$v.advertisement.start.required ? 'border-[#ff0000]' : 'border-gray-300'">
                <DatePick
                v-model="advertisement.start"
                :pickTime="true"
                :format="'YYYY-MM-DD HH:mm'" />
              </div>
              <span class="text-[#ff0000] mt-1"
              v-if="$v.advertisement.start.$dirty && !$v.advertisement.start.required">
                Выберите дату
              </span>
            </div>
            <div class="h-[90px] flex flex-col">
              <label class="font-medium text-gray-700 mb-2">
                Дата и время (Конец)
              </label>
              <div class="border w-fit rounded-md"
              :class="$v.advertisement.finish.$dirty && !$v.advertisement.finish.required ? 'border-[#ff0000]' : 'border-gray-300'">
                <DatePick
                v-model="advertisement.finish"
                :pickTime="true"
                :format="'YYYY-MM-DD HH:mm'"/>
              </div>
              <span class="text-sm text-[#ff0000] mt-1"
              v-if="$v.advertisement.finish.$dirty && !$v.advertisement.finish.required">
                Выберите дату
              </span>
            </div>
          </div>
          <!-- Конец блока выбора дат -->

          <!-- Начало блока выбора фото -->
          <div class="flex flex-col mb-6">
            <p class="mb-1">
              Изображение
            </p>
            <!-- Блок отображается И изменения фото -->
            <div class="flex items-center gap-4">
              <img :src="advertisement.image" alt="Poster Image" width="80" height="80" class="w-[80px] h-[80px]">
              <AddFile id="photoByPoster" @upload="uploadImageAdvertisement">
              <div class="py-2 w-fit px-3 rounded-md bg-white font-medium text-white shadow-sm text-center cursor-pointer border border-[#0048B7] text-[#0048B7]">
                Изменить фото
              </div>
            </AddFile>
            </div>
            <div>
              <p class="text-sm text-[#ff0000] mt-1"
              v-if="$v.advertisement.image.$dirty && !$v.advertisement.image.required">
                Выберите фото
              </p>
              <p class="text-sm text-[#ff0000] mt-1"
              v-if="$v.image.size.$error">
                Размер фото должен быть не более 100 кб
              </p>
            </div>
          </div>
          <!-- Конец блока выбора фото -->

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Поле ввода клиента -->
            <Input v-model="advertisement.client" label="Клиент" placeholder="Введите название клиента"
            :error="$v.advertisement.client.$dirty && !$v.advertisement.client.required">
              <template #error>
                <span v-if="$v.advertisement.client.$dirty && !$v.advertisement.client.required">
                  Введите название клиента
                </span>
              </template>
            </Input>
            <!-- Поле ввода названия -->
            <Input v-model="advertisement.name" label="Название" placeholder="Введите название"
            :error="$v.advertisement.name.$dirty && !$v.advertisement.name.required">
              <template #error>
                <span v-if="$v.advertisement.name.$dirty && !$v.advertisement.name.required">
                  Введите название рекламы
                </span>
              </template>
            </Input>
          </div>

          <!-- Поле выбора расположения рекламы -->
          <Select class="w-full sm:w-1/2" label="Выбор расположения рекламы" :list="locations" textList="value" valueList="value"
          v-model="advertisement.location"/>

          <!-- Поле выбора статуса рекламы -->
          <Select class="w-full sm:w-1/2" label="Статус" :list="$store.state.statusList" textList="title" valueList="value" v-model="advertisement.status"/>

          <!-- Поле ввода ссылки -->
          <Input v-model="advertisement.link" label="Ссылка на промо" placeholder="Вставьте ссылку"
          :error="$v.advertisement.link.$dirty && !$v.advertisement.link.required || $v.advertisement.link.$dirty && !$v.advertisement.link.url">
            <template #error>
              <span v-if="$v.advertisement.link.$dirty && !$v.advertisement.link.required">
                Вставьте ссылку
              </span>
              <span v-if="$v.advertisement.link.$dirty && !$v.advertisement.link.url">
              Введите корректную ссылку
            </span>
            </template>
          </Input>

          <!-- Начало блока кнопок -->
        <div class="flex gap-5">
          <Button :disabled="disabledSave" @click="editAdvertisement">
            Сохранить
          </Button>
          <Button gray
          @click="$router.push('/advertisement')">
            Отменить
          </Button>
        </div>
        <!-- Конец блока кнопок -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {required, url, maxValue} from 'vuelidate/lib/validators'
import {mapState, mapMutations, mapActions} from 'vuex'
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';
import Input from '@/components/inputs/default.vue'
import Select from '@/components/selects/default.vue'
import Button from '@/components/buttons/default.vue'
export default {
  name: 'AddPage',
  components: {
    DatePick, Input, Select, Button
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
  },
  data() {
    return {
      advertisement: {},
      locations: [ /* Список расположения рекламы */
        {
          id: 1,
          value: 'A1'
        },
        {
          id: 2,
          value: 'A2'
        },
        {
          id: 3,
          value: 'A3'
        },
        {
          id: 4,
          value: 'B1'
        },
        {
          id: 5,
          value: 'B2'
        },
      ],
      disabledSave: false,
      image: {}, /* Переменная хранит в себе данные загруженного фото, чтобы в дальнейшем с ней работать */
    }
  },
  validations: {
    advertisement: {
      start: {required},
      finish: {required},
      image: {required},
      client: {required},
      name: {required},
      location: {required},
      link: {required, url}
    },
    image: {
      size: {maxValue: maxValue(100000)}
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
    async editAdvertisement() { /* Функция изменения рекламы */
      if(this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if(!this.disabledSave) { /* Делаем запрос когда кнопка активна */
        this.disabledSave = true /* Делаем после клика кнопку неактивной */
        try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.put(`/advertisements/${this.advertisement.id}`, this.advertisement) /* Запрос добавления */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/advertisement') /* Направляем на страницу реклам */
        } catch(err) {
          this.disabledSave = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    },
    async getAdvertisement() {
      let res = await this.$axios.get(`/advertisements/${this.$route.params.slug}`)
      this.advertisement = res.data.data
    },
    uploadImageAdvertisement(image, event) { /* Функция добавления фото рекламы */
      this.advertisement.image = image.file /* Присваиваем файл в переменную */
      this.image = event /* Присваиваем данные файла в переменную */
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
    if(!this.checkPermission('update-advertising')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.getAdvertisement()
  }
}
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
