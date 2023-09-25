<template>
  <div class="fixed top-0 bg-[#00000046] left-0 w-full h-full z-10 flex items-center justify-center">
    <div class="bg-white max-w-[340px] text-center rounded-lg p-4 flex flex-col gap-4">
      <h2 class="text-[18px]">Выход</h2>
      <p class="text-sm text-[#4B5563]">
        Вы уверены, что хотите выйти? Чтобы снова получить доступ к аккаунту,
        вам необходимо будет повторно авторизоваться.
      </p>
      <div class="flex flex-col gap-2">
        <Button warning full
        @click="logout">
          Выйти
        </Button>
        <Button gray full
        @click="closeModal">
          Отмена
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
import Button from '@/components/buttons/default.vue'
import {mapMutations} from 'vuex'
export default {
  name: 'LogoutModal',
  components: {
    Button
  },
  methods: {
    ...mapMutations({
      change_state: 'CHANGE_STATE'
    }),
    closeModal() { /* Функция закрытия модального окна */
      let payload = {
        key: 'logout',
        body: {
          isActive: false
        }
      }
      this.change_state(payload)
    },
    async logout() { /* Функция выхода с админки */
      await this.$auth.logout().then(() => { /* Запрос выхода с админки */
        this.closeModal() /* Закрываем модальное окно */
        localStorage.removeItem('permissions') /* Удаляем доступы с localeStorage */
        let payload = {
          key: 'permissions',
          body: []
        }
        this.change_state(payload) /* Очищаем массив доступов */
        this.$router.push("/login") /* Направляем на страницу логина */
      });
    }
  }
}
</script>
