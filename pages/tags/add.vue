<template>
  <div>
    <!-- Начало заголовка -->
    <p class="font-bold text-2xl">
      Добавление тега
    </p>
    <!-- Конец заголовка -->

    <div class="mt-6 bg-white p-4 rounded-lg">
      <Input v-model="name" label="Название" placeholder="#Введите название тега"
      :error="$v.name.$dirty && !$v.name.required">
        <template #error>
          <span v-if="$v.name.$dirty && !$v.name.required">
            Введите название тега
          </span>
        </template>
      </Input>
      <div class="mt-6 flex gap-5">
        <Button :disabled="disabledSave" @click="addTag">
          Сохранить
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
      name: '',
      disabledSave: false,
    }
  },
  validations: {
    name: {required}
  },
  methods: {
    ...mapMutations({
      loading_alert: 'alert/LOADING_ALERT'
    }),
    ...mapActions({
      success_alert: 'alert/success_alert',
      error_alert: 'alert/error_alert'
    }),
    async addTag() {
      if(this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if(!this.disabledSave) { /* Делаем запрос когда кнопка активна */
        this.disabledSave = true /* Делаем после клика кнопку неактивной */
      try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.post('/tags', {name: this.name}) /* Запрос добавления */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/tags') /* Направляем на страницу афиш */
        } catch(err) {
          this.disabledSave = false /* В случае ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Открываем ошибочное модальное окно */
        }
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
    if(!this.checkPermission('create-tags')) {
      this.$router.back(-1)
    }
  },
};
</script>
