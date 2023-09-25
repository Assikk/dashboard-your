<template>
  <div>
    <head-grid>
      <head-title head_title="Профиль" />
    </head-grid>
    <main-bg>
      <add-posts-form-slot>
        <settingsTab>
          <div class="sm:p-8">
            <tab name="Личные данные" selected="true">
              <div>
                <h2 class="mb-7">Личные данные</h2>
                <div class="grid sm:grid-cols-2 gap-4 sm:grid-rows-2">
                  <Input
                  id="first_name"
                  label="Имя"
                  :error="$v.user.first_name.$dirty && !$v.user.first_name.required"
                  v-model="user.first_name">
                  <template #error>
                    <span v-if="$v.user.first_name.$dirty && !$v.user.first_name.required">
                      Это поле обязательно для заполнения
                    </span>
                  </template>
                  </Input>
                  <Input
                  id="last_name"
                  label="Фамилия"
                  :error="$v.user.last_name.$dirty && !$v.user.last_name.required"
                  v-model="user.last_name">
                  <template #error>
                    <span v-if="$v.user.last_name.$dirty && !$v.user.last_name.required">
                      Это поле обязательно для заполнения
                    </span>
                  </template>
                  </Input>
                  <Input
                  id="email"
                  label="Электронная почта"
                  :error="$v.user.email.$dirty && !$v.user.email.required || $v.user.email.$dirty && !$v.user.email.email"
                  v-model="user.email">
                  <template #error>
                    <span v-if="$v.user.email.$dirty && !$v.user.email.required">
                      Это поле обязательно для заполнения
                    </span>
                    <span v-else-if="$v.user.email.$dirty && !$v.user.email.email">
                      Введите именно почту
                    </span>
                  </template>
                  </Input>
                </div>
                <div class="flex gap-5 my-3">
                  <Button @click="updateUser">Сохранить</Button>
                  <Button gray @click="$router.go(-1)">Отменить</Button>
                </div>
              </div>
            </tab>

            <tab name="Безопасность">
              <div>
                <h2 class="mb-7">Безопасность</h2>
                <div class="w-1/2 flex flex-col gap-4">
                  <Password
                  id="old_password"
                  label="Старый пароль"
                  type="password"
                  :error="$v.password.current_password.$dirty && !$v.password.current_password.required || $v.password.current_password.$dirty && !$v.password.current_password.minLength"
                  v-model="password.current_password">
                  <template #error>
                    <span v-if="$v.password.current_password.$dirty && !$v.password.current_password.required">
                      Это поле обязательно для заполнения
                    </span>
                    <span v-else-if="$v.password.current_password.$dirty && !$v.password.current_password.minLength">
                      Пароль должен быть больше 8 символов
                    </span>
                  </template>
                  </Password>
                  <Password
                  id="new_password"
                  label="Новый пароль"
                  type="password"
                  :error="$v.password.password.$dirty && !$v.password.password.required || $v.password.password.$dirty && !$v.password.password.minLength"
                  v-model="password.password">
                  <template #error>
                    <span v-if="$v.password.password.$dirty && !$v.password.password.required">
                      Это поле обязательно для заполнения
                    </span>
                    <span v-else-if="$v.password.password.$dirty && !$v.password.password.minLength">
                      Пароль должен быть больше 8 символов
                    </span>
                  </template>
                  </Password>
                  <Password
                  id="confirm_password"
                  label="Повторите пароль"
                  type="password"
                  :error="$v.password.password_confirmation.$dirty && !$v.password.password_confirmation.required || $v.password.password_confirmation.$dirty && !$v.password.password_confirmation.minLength"
                  v-model="password.password_confirmation">
                  <template #error>
                    <span v-if="$v.password.password_confirmation.$dirty && !$v.password.password_confirmation.required">
                      Это поле обязательно для заполнения
                    </span>
                    <span v-else-if="$v.password.password_confirmation.$dirty && !$v.password.password_confirmation.minLength">
                      Пароль должен быть больше 8 символов
                    </span>
                  </template>
                  </Password>
                </div>
                <div class="flex gap-5 my-3">
                  <Button @click="updatePassword">Сохранить</Button>
                  <Button gray @click="$router.go(-1)">Отменить</Button>
                </div>
              </div>
            </tab>
          </div>
        </settingsTab>
      </add-posts-form-slot>
    </main-bg>
  </div>
</template>

<script>
import {required, email, minLength} from 'vuelidate/lib/validators'
import {mapMutations, mapActions} from 'vuex'
import Button from '@/components/buttons/default.vue'
import Input from '@/components/inputs/default.vue'
import Password from '@/components/inputs/password.vue'
import settingsTab from "@/components/tabComponents/settingsTab.vue";
export default {
  name: "settings",
  head: {
    title: 'Профиль'
  },
  components: {settingsTab, Button, Input, Password },
  data() {
    return {
      user: JSON.parse(JSON.stringify(this.$store.state.auth.user)),
      password: {
        current_password: '',
        password: '',
        password_confirmation: ''
      }
    };
  },
  validations: {
    user: {
      first_name: {required},
      last_name: {required},
      email: {required, email},
    },
    password: {
      current_password: {required, minLength: minLength(8)},
      password: {required, minLength: minLength(8)},
      password_confirmation: {required, minLength: minLength(8)}
    },
    validationsGroup: ['user', 'password']
  },
  methods: {
    ...mapMutations({
      loading_alert: 'alert/LOADING_ALERT'
    }),
    ...mapActions({
      success_alert: 'alert/success_alert',
      error_alert: 'alert/error_alert'
    }),
    async updateUser() {
      try {
        if(this.$v.validationsGroup.user.$invalid) {
          this.$v.validationsGroup.user.$touch()
          return
        }
        this.loading_alert()
        let res = await this.$axios.put('/profile', {
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          email: this.user.email
        })
        this.success_alert()
        this.$auth.setUser(res.data.data)
      } catch(err) {
        this.error_alert(err.response.data.message)
      }

    },
    async updatePassword() {
      try {
        if(this.$v.validationsGroup.password.$invalid) {
          this.$v.validationsGroup.password.$touch()
          return
        }
        this.loading_alert()
        await this.$axios.post('/profile/update-password', this.password)
        this.success_alert()
      } catch(err) {
        this.error_alert(err.response.data.message)
      }

    }
  },
};
</script>
