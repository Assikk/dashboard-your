<template>
  <div>
    <p class="font-bold text-2xl">
      Добавление пользователя
    </p>
    <div class="bg-white mt-4 p-4">
        <div class="grid md:grid-cols-3 gap-7 mb-7">
          <Input id="first_name"
          label="Имя"
          :error="$v.user.first_name.$dirty && !$v.user.first_name.required"
          v-model="user.first_name">
          <template #error>
            <span v-if="$v.user.first_name.$dirty && !$v.user.first_name.required">
              Это поле обязательно для заполнения
            </span>
          </template>
          </Input>
          <Input id="last_name"
          label="Фамилия"
          :error="$v.user.last_name.$dirty && !$v.user.last_name.required"
          v-model="user.last_name">
          <template #error>
            <span v-if="$v.user.last_name.$dirty && !$v.user.last_name.required">
              Это поле обязательно для заполнения
            </span>
          </template>
          </Input>
          <Input id="email"
          label="Электронная почта"
          :error="$v.user.email.$dirty && !$v.user.email.required || $v.user.email.$dirty && !$v.user.email.email"
          v-model="user.email">
          <template #error>
            <span v-if="$v.user.email.$dirty && !$v.user.email.required">
              Это поле обязательно для заполнения
            </span>
            <span v-if="$v.user.email.$dirty && !$v.user.email.email">
              Указан неправильный формат почты
            </span>
          </template>
          </Input>
          <Select
          label="Статус"
          id="status"
          iconLocation="99"
          :list="activeList"
          textList="title"
          valueList="value"
          :error="$v.user.status_id.$dirty && !$v.user.status_id.required"
          v-model="user.status_id">
          <template #error>
            <span v-if="$v.user.status_id.$dirty && !$v.user.status_id.required">
              Это поле обязательно для заполнения
            </span>
          </template>
          </Select>
          <Select
          label="Роль"
          id="roleId"
          iconLocation="99"
          :list="roleList"
          textList="title"
          valueList="value"
          :error="$v.user.role_id.$dirty && !$v.user.role_id.required"
          v-model="user.role_id">
          <template #error>
            <span v-if="$v.user.role_id.$dirty && !$v.user.role_id.required">
              Это поле обязательно для заполнения
            </span>
          </template>
          </Select>
          <div class="md:col-start-1 md:col-end-2">
            <Password id="password"
            label="Пароль"
            type="password"
            :error="$v.user.password.$dirty && !$v.user.password.required || $v.user.password.$dirty && !$v.user.password.minLength"
            v-model="user.password">
            <template #error>
              <span v-if="$v.user.password.$dirty && !$v.user.password.required">
                Это поле обязательно для заполнения
              </span>
              <span v-else-if="$v.user.password.$dirty && !$v.user.password.minLength">
                Пароль должен быть больше 8 символов
              </span>
            </template>
            </Password>
          </div>
          <div class="md:col-start-2 md:col-end-3">
            <Password id="confirm_password"
            label="Повторите пароль"
            type="password"
            :error="$v.user.password_confirmation.$dirty && !$v.user.password_confirmation.required || $v.user.password_confirmation.$dirty && !$v.user.password_confirmation.minLength"
            v-model="user.password_confirmation">
            <template #error>
              <span v-if="$v.user.password_confirmation.$dirty && !$v.user.password_confirmation.required">
                Это поле обязательно для заполнения
              </span>
              <span v-else-if="$v.user.password_confirmation.$dirty && !$v.user.password_confirmation.minLength">
                Пароль должен быть больше 8 символов
              </span>
            </template>
            </Password>
          </div>
        </div>
        <div class="flex flex-wrap gap-7">
          <Button :disabled="disabledSave" @click="addUser">
            Сохранить
          </Button>
          <Button gray
          @click="$router.push('/users')">
            Отменить
          </Button>
        </div>
      </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import {required, minLength, email} from 'vuelidate/lib/validators'
import Input from '@/components/inputs/default.vue'
import Password from '@/components/inputs/password.vue'
import Select from '@/components/selects/default.vue'
import Button from '@/components/buttons/default.vue'
export default {
  name: 'addUser',
  head: {
    title: 'Добавление пользователя'
  },
  components: {
    Input, Button, Select,Password
  },
  computed: {
    ...mapState({
      activeList: state => state.activeList,
      roleList: state => state.roleList,
      permissions: state => state.permissions
    })
  },
  data() {
    return {
      user: { /* Переменная, которая будет хранит данные пользователя введенные в форме */
        first_name: '',
        last_name: '',
        email: '',
        status_id: '',
        role_id: '',
        password: '',
        password_confirmation: ''
      },
      disabledSave: false /* Переменная, хранит в себе статус кнопки */
    };
  },
  validations: {
    user: {
      first_name: {required},
      last_name: {required},
      email: {required, email},
      status_id: {required},
      role_id: {required},
      password: {required, minLength: minLength(8)},
      password_confirmation: {required, minLength: minLength(8)}
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
    async addUser() { /* Функция добавления нового пользователя */
      if(this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if(!this.disabledSave) { /* Делаем запрос когда кнопка активна */
        this.disabledSave = true /* Делаем после клика кнопку неактивной */
        try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          await this.$axios.post('/users', this.user) /* Запрос добавления */
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/users') /* Направляем на страницу пользователей */
        } catch (err) {
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
    if(!this.checkPermission('create-users')) {
      this.$router.back(-1)
    }
  },
};
</script>
