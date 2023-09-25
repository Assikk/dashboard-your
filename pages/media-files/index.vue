<template>
  <div>
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between mb-4">
      <h1 class="font-bold text-2xl">
        Медиафайлы
      </h1>
      <div class="flex gap-4">
        <Button secondary :disabled="disabledDelete"
        @click="deleteFile">
          Удалить
        </Button>
        <AddFile id="mediaFile"
        accept="image/*"
        @upload="getFiles">
          <Button addFile>
            <template #prev-icon>
              <svg width="20" height="20" fill="white">
                <use xlink:href="#plus"/>
              </svg>
            </template>
            Добавить
          </Button>
        </AddFile>
      </div>
    </div>
    <div class="my-4">
      <Search placeholder="Поиск медиа файла по названию"
      @input="searchMediaFile"
      v-model="search"/>
    </div>
    <div class="flex gap-4">
      <div :class="Object.keys(this.activeFile).length ? 'w-full lg:w-3/4' : 'w-full'">
        <div class="flex flex-wrap gap-4">
          <div class="relative cursor-pointer rounded-md w-[205px]" v-for="file in files" :key="file.id"
          @click="clickFile(file)">
          <div class="shadow-md flex flex-col gap-2 rounded-md">
            <img :src="file.file" :alt="file.name" class="h-[205px] w-full rounded-md">
            <p class="name text-center p-2 pb-1">
              {{file.name}}
            </p>
          </div>
            <div v-if="activeFile.id == file.id" class="absolute flex justify-end items-end top-0 left-0 w-full h-full bg-[#0048B7] opacity-50 rounded-md"/>
            <svg v-if="activeFile.id == file.id" class="absolute bottom-1 right-1 z-10 pr-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="12" fill="#0048B7"/>
              <path d="M16.9158 8.25416C17.1348 8.47324 17.2578 8.77034 17.2578 9.08012C17.2578 9.3899 17.1348 9.687 16.9158 9.90608L11.0743 15.7474C10.8552 15.9664 10.5581 16.0894 10.2483 16.0894C9.93854 16.0894 9.64143 15.9664 9.42234 15.7474L7.08577 13.4109C6.87295 13.1905 6.75519 12.8954 6.75786 12.5891C6.76052 12.2828 6.88339 11.9898 7.1 11.7732C7.31661 11.5566 7.60963 11.4337 7.91595 11.431C8.22227 11.4284 8.51738 11.5461 8.73773 11.7589L10.2483 13.2695L15.2638 8.25416C15.4829 8.03515 15.78 7.91211 16.0898 7.91211C16.3996 7.91211 16.6967 8.03515 16.9158 8.25416Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-if="Object.keys(this.activeFile).length" class="hidden lg:flex bg-white border border-gray rounded-md w-1/4 p-4 flex-col gap-4">
          <div class="flex gap-2">
            <img class="w-1/2 h-32 rounded" :src="file.file" :alt="file.alt">
            <div class="text-sm flex flex-col gap-2">
              <p>{{file.size / 1000}} KB</p>
              <p>
                {{file.width}} х {{file.height}}
              </p>
              <AddFile getFile id="changeMediaFile"
              accept="image/*"
              @upload="editMediaFile">
                <p class="cursor-pointer text-[#4F46E5]">
                  Редактировать
                </p>
              </AddFile>
              <p class="cursor-pointer text-[#DC2626]"
              @click="deleteFile">
                Удалить
              </p>
            </div>
          </div>
          <Input v-model="file.name" label="Название"/>
          <Input v-model="file.alt" label="Атрибут alt"/>
          <Input v-model="file.signature" label="Подпись"/>
          <Link v-model="file.file" label="Ссылка"/>
          <TextArea v-model="file.description" label="Описание"/>
          <Button outlined :disabled="disabledSave"
          @click="changeMediaFile">
            Сохранить
          </Button>
        </div>
      </transition>
      <transition name="fade">
        <Card v-if="isShowCardMediaFile" @deleteFile="deleteFile" :file="file" :disabledSave="disabledSave" class="block lg:hidden"
        @close="activeFile = {}" @save="changeMediaFile"/>
      </transition>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import AddFile from '@/components/AddFile.vue'
import Search from '@/components/inputs/search.vue'
import Button from "@/components/buttons/default.vue";
import Input from '@/components/inputs/default.vue'
import TextArea from '@/components/textarea.vue'
import Link from '@/components/inputs/link.vue'
import Card from '@/components/modals/cardMediaFile.vue'
export default {
  name: "mediaFilesPage",
  components: {
    Button,
    AddFile,
    Search,
    Input,
    TextArea,
    Link,
    Card
  },
  computed: {
    ...mapState({
      isShowCardMediaFile: state => state.isShowCardMediaFile
    })
  },
  data() {
    return {
      files: [], /* Переменная хранит в себе список медиа файлов */
      search: '', /* Переменная, хранит в себе значение введенное в поле поиска */
      activeFile: {}, /* Переменная, хранит в себе выбранный файл */
      disabledDelete: false, /* Переменная, хранит в себе статус кнопки удаления медиафайла */
      disabledSave: false, /* Переменная, хранит в себе статус кнопки сохранения */
      disabledEdit: false, /* Переменная, хранит в себе статус редактирования */
      file: {} /* Копированный объект для формы изменения */
    };
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
    async getFiles() { /* Get запрос медиа файлов */
      this.files = [] /* Очищаем предыдущий список */
      let res = await this.$axios.get('/media-files') /* Сам запрос */
      this.files = res.data.data; /* Записываем данные с бэка в переменную */
      if(this.files.length > 0) {
        this.activeFile = this.files[0]
        this.showModalCard()
      } else this.activeFile = {}
    },
    async searchFiles() { /* Функция поиска медиафайлов */
      this.files = [] /* Перед каждым запросом очищаем список медиафайлов */
      let res = await this.$axios.get(`/search/media-files?keyword=${this.search}`) /* Сам запрос */
      this.files = res.data.data /* Записываем медиафайлы в переменную */
      if(this.files.length > 0) {
        this.activeFile = this.files[0]
      } else this.activeFile = {}
    },
    searchMediaFile() { /* Функция поиска срабатывает после каждого введенного символа */
      if(this.search.length > 2) { /* Если в поле поиска больше 2 символов делаем запрос поиска */
        this.searchFiles()
      }
      if(this.search.length == 0) { /* Если поле поиска пустое то делаем get запрос всем медиафайлов */
        this.getFiles()
      }
    },
    showModalCard() { /* Функция показывает карточку медиафайла */
      let payload = {
        key: 'isShowCardMediaFile',
        body: true
      }
      this.change_state(payload)
    },
    clickFile(file) { /* Функция клика медиафайла */
      if(this.activeFile.id == file.id) { /* Если клик произошел уже по активному файлу */
        this.activeFile = {} /* Очищаем активный файл */
        this.disabledDelete = true /* Делаем кнопку удаления неактивной */
      } else { /* Если клик произошел не по активному файлу */
        this.activeFile = file /* Записываем выбранный файл в переменную */
        this.disabledDelete = false /* Делаем кнопку активной */
        this.showModalCard()
      }
    },
    async deleteFile() { /* Функция удаления медиафайла */
      if(!this.disabledDelete) { /* Функция работает тогда, когда кнопка удаления активная */
        this.disabledDelete = true /* Сразу после клика делаем кнопку удаления неактивной */
        try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.delete(`/media-files/${this.activeFile.id}`) /* Сам запрос */
          await this.getFiles() /* После запроса удаления повторно берем обновленные данные медиафайлов */
          this.success_alert() /* Открываем успешное модальное окно */
          if(this.files.length > 0) {
            this.disabledDelete = false
          } else this.disabledDelete = true
        } catch(err) {
          this.disabledDelete = true /* В случае ошибки делаем кнопку удаления активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    },
    async changeMediaFile() { /* Функция изменения данных медиафайла */
      const newFile = {} /* Объект, будет хранить в себе измененные поля формы */
      let keys = Object.keys(this.activeFile)
      keys.forEach((item) => {
        if (this.activeFile[item] !== this.file[item]) {
          newFile[item] = this.file[item]
        }
      })
      this.disabledSave = true
      try {
        this.loading_alert() /* Открываем загрузечное модальное окно */
        await this.$axios.put(`/media-files/${this.file.id}`, newFile)
        this.searchMediaFile()
        this.success_alert() /* Открываем успешное модальное окно */
        this.disabledSave = false
      } catch(err) {
        this.disabledSave = false
        this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
      }
    },
    async editMediaFile(photo) { /* Фукнция меняющая данные медиафайла */
      if(!this.disabledEdit) {
        this.disabledEdit = true
        try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.delete(`/media-files/${this.file.id}`)
          let name = photo.name
          name = name.substr(0, name.lastIndexOf('.'))
          let formData = new FormData()
          formData.append('file', photo)
          formData.append('name', name)
          formData.append('alt', this.file.alt)
          formData.append('signature', this.file.signature)
          formData.append('description', this.file.description)
          await this.$axios.post('/media-files', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
          this.success_alert() /* Открываем успешное модальное окно */
          this.getFiles()
          this.disabledEdit = false
        } catch(err) {
          this.disabledEdit = false
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
      console.log(photo);
    }
  },
  mounted() {
    this.getFiles()
  },
  watch: {
    activeFile() {
      this.file = JSON.parse(JSON.stringify(this.activeFile))
    }
  }
};
</script>
<style scoped>
.name {
  overflow: hidden;
	text-overflow: ellipsis;
  display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}
</style>
