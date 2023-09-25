<template>
  <div>
    <!-- Начало заголовка -->
    <p class="font-bold text-2xl">
      Изменение тега
    </p>
    <!-- Конец заголовка -->

    <div class="mt-6 bg-white p-4 rounded-lg">
      <Input v-model="tag.name" label="Название" placeholder="#Введите название тега"
      :error="$v.tag.name.$dirty && !$v.tag.name.required">
        <template #error>
          <span v-if="$v.tag.name.$dirty && !$v.tag.name.required">
            Введите название тега
          </span>
        </template>
      </Input>
      <div class="mt-6 flex gap-5">
        <Button :disabled="disabledSave" @click="editTag">
          Сохранить
        </Button>
        <Button warning :disabled="disabledDelete" @click="deleteTag">
          Удалить
        </Button>
        <Button gray
        @click="$router.push('/tags')">
          Отменить
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
import {required} from 'vuelidate/lib/validators'
import {mapState, mapMutations, mapActions} from 'vuex'
import Input from '@/components/inputs/default.vue'
import Button from '@/components/buttons/default.vue'
export default {
  name: "AddTag",
  components: {
    Input,
    Button
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
  },
  data() {
    return {
      tag: {},
      disabledSave: false,
      disabledDelete: false,
    }
  },
  validations: {
    tag: {
      name: {required}
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
    async editTag() {
      if(this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if(!this.disabledSave) { /* Делаем запрос когда кнопка активна */
        this.disabledSave = true /* Делаем после клика кнопку неактивной */
      try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.put(`/tags/${this.tag.id}`, {name: this.tag.name}) /* Запрос изменения */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/tags') /* Направляем на страницу тегов */
        } catch(err) {
          this.disabledSave = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    },
    async deleteTag() {
      if(!this.disabledDelete) { /* Делаем запрос когда кнопка активна */
        this.disabledDelete = true /* Делаем после клика кнопку неактивной */
      try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.delete(`/tags/${this.tag.id}`) /* Запрос удаления */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/tags') /* Направляем на страницу тегов */
        } catch(err) {
          this.disabledDelete = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
      }
    },
    async getTag() {
      let res = await this.$axios.get(`/tags/${this.$route.params.slug}`)
      this.tag = res.data.data
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
    if(!this.checkPermission('update-tags')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.getTag()
  }
};
</script>
