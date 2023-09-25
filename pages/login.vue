<template>
  <div
    class="flex min-h-[90vh] flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
    <div :class="{ shake: loginError }" class="sm:mx-auto sm:w-full sm:max-w-md shadow-md">
      <div class="mx-auto w-full bg-white pt-8 rounded-t-lg sm:mx-auto sm:w-full sm:max-w-md">
        <img class="mx-auto" src="../assets/images/your.png" alt="your" />
      </div>
      <div class="bg-white py-8 px-4 sm:rounded-b-lg sm:px-10" @keypress.enter="login">
        <h2 class="text-center mt-4 mb-8 text-2xl">Войдите в аккаунт</h2>
        <div class="flex flex-col gap-6">
          <Input
          id="email"
          label="Введите email"
          :error="$v.email.$dirty && !$v.email.required || $v.email.$dirty && !$v.email.email"
          v-model="email">
          <template #error>
            <span v-if="$v.email.$dirty && !$v.email.required">
              Это поле обязательно для заполнения
            </span>
            <span v-if="$v.email.$dirty && !$v.email.email">
              Указан неправильный формат почты
            </span>
          </template>
          </Input>
          <Password
          id="password"
          label="Введите пароль"
          type="password"
          :error="$v.password.$dirty && !$v.password.required || $v.password.$dirty && !$v.password.minLength"
          v-model="password">
          <template #error>
            <span v-if="$v.password.$dirty && !$v.password.required">
              Это поле обязательно для заполнения
            </span>
            <span v-else-if="$v.password.$dirty && !$v.password.minLength">
              Пароль должен быть больше 8 символов
            </span>
          </template>
          </Password>
          <Button
          full
          :disabled="disabledLogin"
          @click="login">
            Войти
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {required, minLength, email} from 'vuelidate/lib/validators'
import {mapMutations, mapActions} from 'vuex'
import Input from '@/components/inputs/default.vue'
import Password from '@/components/inputs/password.vue'
import Button from '@/components/buttons/default.vue'
export default {
  name: "LoginPage",
  head: {
    title: 'Авторизация'
  },
  middleware: "auth",
  layout: "login",
  components: {
    Input, Button, Password
  },
  data() {
    return {
      email: "",
      password: "",
      loginError: false,
      disabledLogin: false /* Переменная, отвечающая за активное и неактивное состояние кнопки Авторизации */
    };
  },
  validations: {
    email: {required, email},
    password: {required, minLength: minLength(8)},
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
    async login() {
      this.loginError = false
      if(this.$v.$invalid) {
        this.$v.$touch()
        this.loginError = true
        return
      }
      if(!this.disabledLogin) {
        try {
          this.disabledLogin = true /* Сразу после клика делаем кнопку неактивной */
          this.loading_alert() /* Запуск загрузечного модального окна */
          let res = await this.$auth.loginWith("local", {
              data: {
                email: this.email,
                password: this.password,
              },
            })
            localStorage.setItem('permissions', JSON.stringify(res.data.data.user.permission))
            let payload = {
              key: 'permissions',
              body: res.data.data.user.permission
            }
            this.change_state(payload)
            this.loginError = false
            this.success_alert() /* Запуск успешного модального окна */
            this.$router.push("/") /* Направляем на главную страницу */
        } catch (err) {
          this.disabledLogin = false /* В случае получении ошибки делаем кнопку активной */
          this.error_alert(err.response.data.message) /* Запуск ошибочного модального окна */
          this.loginError = true
        }
      }
    },
  },
};
</script>
