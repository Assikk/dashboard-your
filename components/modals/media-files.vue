<template>
  <div class="fixed top-0 bg-[#00000046] left-0 w-full h-full z-40 flex items-center justify-center">
    <div class="bg-[#F9F9F9] w-[90%] h-[90%] overflow-y-auto rounded-lg px-12 py-10">
      <div class="bg-white p-4 flex flex-wrap sm:flex-nowrap gap-4 items-center my-6">
        <Search class="w-full mx-0" v-model="search"
        placeholder="Поиск медиа файла по названию"
        @input="searchMediaFile"/>
        <AddFile id="addMediaFile"
        accept="image/*"
        @upload="getFiles">
          <Button addFile outlined class="w-full sm:w-auto">
            Добавить
          </Button>
        </AddFile>
      </div>
      <div class="flex gap-4">
        <div :class="Object.keys(this.activeFile).length ? 'w-full lg:w-3/4' : 'w-full'">
          <div class="flex justify-center sm:justify-start flex-wrap gap-4">
            <div v-for="file in files" :key="file.id" class="w-full sm:w-[250px] relative cursor-pointer rounded-md"
            @click="clickFile(file)">
            <div class="flex flex-col gap-2 shadow-md rounded-md">
              <img :src="file.file" :alt="file.name" class="h-[250px] w-full rounded-md">
              <p class="name text-center p-2 pb-1">
                {{file.name}}
              </p>
            </div>
              <div v-if="activeFile.id == file.id" class="absolute flex justify-end items-end top-0 left-0 w-full h-full bg-[#0048B7] opacity-50 rounded-md">
              </div>
              <svg v-if="activeFile.id == file.id" class="absolute bottom-1 right-1 z-10 pr-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="12" fill="#0048B7"/>
                <path d="M16.9158 8.25416C17.1348 8.47324 17.2578 8.77034 17.2578 9.08012C17.2578 9.3899 17.1348 9.687 16.9158 9.90608L11.0743 15.7474C10.8552 15.9664 10.5581 16.0894 10.2483 16.0894C9.93854 16.0894 9.64143 15.9664 9.42234 15.7474L7.08577 13.4109C6.87295 13.1905 6.75519 12.8954 6.75786 12.5891C6.76052 12.2828 6.88339 11.9898 7.1 11.7732C7.31661 11.5566 7.60963 11.4337 7.91595 11.431C8.22227 11.4284 8.51738 11.5461 8.73773 11.7589L10.2483 13.2695L15.2638 8.25416C15.4829 8.03515 15.78 7.91211 16.0898 7.91211C16.3996 7.91211 16.6967 8.03515 16.9158 8.25416Z" fill="white"/>
              </svg>
            </div>
          </div>
          <!-- Начало блока кнопок -->
          <div class="flex gap-5 mt-6">
            <Button :disabled="disabledSave" @click="saveFile(activeFile)">
              Сохранить
            </Button>
            <Button gray
            @click="closeModal">
              Отменить
            </Button>
          </div>
          <!-- Конец блока кнопок -->
        </div>
        <transition name="fade">
          <div v-if="Object.keys(activeFile).length"
          class="hidden lg:flex bg-white border border-gray rounded-md w-1/4 p-4 flex-col gap-4">
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
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import Search from '@/components/inputs/search.vue'
import Button from '@/components/buttons/default.vue'
import AddFile from '@/components/AddFile.vue'
import {mapMutations, mapActions} from 'vuex'
import Input from '@/components/inputs/default.vue'
import TextArea from '@/components/textarea.vue'
import Link from '@/components/inputs/link.vue'
export default {
  name: 'MediaFilesModal',
  components: {
    Search, Button, AddFile, Input, TextArea, Link
  },
  data() {
    return {
      files: [], /* Переменная хранит в себе список медиа файлов */
      search: '', /* Переменная хранит в себе значение введенное в поле поиска */
      activeFile: {}, /* Переменная хранит в себе активный выбранный файл */
      disabledSave: true, /* Переменная хранит в себе статус кнопки сохранения */
      disabledEdit: false, /* Переменная, хранит в себе статус редактирования */
      disabledDelete: false, /* Переменная, хранит в себе статус кнопки удаления медиафайла */
      file: {} /* Копированный объект для формы изменения */
    }
  },
  methods: {
    ...mapMutations({
      change_state: 'CHANGE_STATE',
      loading_alert: 'alert/LOADING_ALERT',
    }),
    ...mapActions({
      success_alert: 'alert/success_alert',
      error_alert: 'alert/error_alert'
    }),
    closeModal() {
      let payload = {
        key: 'isShowMediaFiles',
        body: false
      }
      this.change_state(payload)
    },
    async searchFiles() {
      this.files = []
      let res = await this.$axios.get(`/search/media-files?keyword=${this.search}`)
      this.files = res.data.data
      if(this.files.length > 0) {
        this.activeFile = this.files[0]
      } else this.activeFile = {}
    },
    saveFile(file) {
      this.$emit('save', file)
      this.closeModal()
    },
    searchMediaFile() { /* Функция поиска медиа файла */
      if(this.search.length > 2) {
        this.searchFiles()
      }
      if(this.search.length == 0) {
        this.getFiles()
      }
    },
    async getFiles() { /* Get запрос медиа файлов */
      this.files = [] /* Очищаем предыдущий список */
      let res = await this.$axios.get('/media-files') /* Сам запрос */
      this.files = res.data.data; /* Записываем данные с бэка в переменную */
      if(this.files.length > 0) {
        this.activeFile = this.files[0]
        this.disabledSave = false
      } else this.activeFile = {}
    },
    clickFile(file) {
      if(this.activeFile.id == file.id) {
        this.activeFile = {}
        this.disabledSave = true
      } else {
        this.activeFile = file
        this.disabledSave = false
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
  },
  mounted() {
    this.getFiles()
  },
  watch: {
    activeFile() {
      this.file = JSON.parse(JSON.stringify(this.activeFile))
    }
  }
}
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
