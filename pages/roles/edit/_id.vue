<template>
  <div v-if="role">
    <h1 class="font-bold text-2xl mb-4">
      Настройки ролей ({{role.name}})
    </h1>
    <Table :head="rolesHead">
      <template #body>
        <tr v-for="item in rolesBody" :key="item.id">
          <td class="w-[300px]">
            {{item.title}}
          </td>
          <td>
            <input v-model="item.readChecked" type="checkbox">
          </td>
          <td>
            <input v-model="item.createChecked" type="checkbox">
          </td>
          <td>
            <input v-model="item.updateChecked" type="checkbox">
          </td>
          <td>
            <input v-model="item.deleteChecked" type="checkbox">
          </td>
        </tr>
      </template>
    </Table>
    <!-- Начало блока кнопок -->
    <div class="mt-6 flex gap-5">
      <Button :disabled="disabledSave" @click="editRole">
        Сохранить
      </Button>
      <Button gray
      @click="$router.push('/roles')">
        Отменить
      </Button>
    </div>
    <!-- Конец блока кнопок -->
  </div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import Table from '@/components/table.vue'
import Button from '@/components/buttons/default.vue'
export default {
  name: 'editRole',
  head: {
    title: `Настройки ролей`
  },
  components: {
    Table, Button
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions
    }),
  },
  data() {
    return {
      role: null,
      rolesHead: [
        {
          id: 1,
        },
        {
          id: 2,
          title: 'Просмотр'
        },
        {
          id: 3,
          title: 'Создание'
        },
        {
          id: 4,
          title: 'Редактирование'
        },
        {
          id: 5,
          title: 'Удаление'
        }
      ],
      rolesBody: [
        {
          id: 1,
          title: 'Рубрики',
          readId: 5,
          readChecked: false,
          createId: 6,
          createChecked: false,
          updateId: 7,
          updateChecked: false,
          deleteId: 8,
          deleteChecked: false
        },
        {
          id: 2,
          title: 'Публикации',
          readId: 9,
          readChecked: false,
          createId: 10,
          createChecked: false,
          updateId: 11,
          updateChecked: false,
          deleteId: 12,
          deleteChecked: false
        },
        {
          id: 3,
          title: 'Афиша',
          readId: 41,
          readChecked: false,
          createId: 42,
          createChecked: false,
          updateId: 43,
          updateChecked: false,
          deleteId: 44,
          deleteChecked: false
        },
        {
          id: 4,
          title: 'Спец проекты',
          readId: 13,
          readChecked: false,
          createId: 14,
          createChecked: false,
          updateId: 15,
          updateChecked: false,
          deleteId: 16,
          deleteChecked: false
        },
        {
          id: 5,
          title: 'Пользователи',
          readId: 17,
          readChecked: false,
          createId: 18,
          createChecked: false,
          updateId: 19,
          updateChecked: false,
          deleteId: 20,
          deleteChecked: false
        },
        {
          id: 6,
          title: 'Реклама',
          readId: 21,
          readChecked: false,
          createId: 22,
          createChecked: false,
          updateId: 23,
          updateChecked: false,
          deleteId: 24,
          deleteChecked: false
        },
        {
          id: 7,
          title: 'Комментарии',
          readId: 25,
          readChecked: false,
          createId: 26,
          createChecked: false,
          updateId: 27,
          updateChecked: false,
          deleteId: 28,
          deleteChecked: false
        },
        {
          id: 8,
          title: 'Медиа файлы',
          readId: 29,
          readChecked: false,
          createId: 30,
          createChecked: false,
          updateId: 31,
          updateChecked: false,
          deleteId: 32,
          deleteChecked: false
        },
        {
          id: 9,
          title: 'История',
          readId: 33,
          readChecked: false,
          createId: 34,
          createChecked: false,
          updateId: 35,
          updateChecked: false,
          deleteId: 36,
          deleteChecked: false
        },
        {
          id: 10,
          title: 'Роли',
          readId: 49,
          readChecked: false,
          createId: 50,
          createChecked: false,
          updateId: 51,
          updateChecked: false,
          deleteId: 52,
          deleteChecked: false
        },
        {
          id: 11,
          title: 'Теги',
          readId: 45,
          readChecked: false,
          createId: 46,
          createChecked: false,
          updateId: 47,
          updateChecked: false,
          deleteId: 48,
          deleteChecked: false
        },
        // {
        //   id: 12,
        //   title: 'Настройки',
        //   readId: 37,
        //   readChecked: false,
        //   createId: 38,
        //   createChecked: false,
        //   updateId: 39,
        //   updateChecked: false,
        //   deleteId: 40,
        //   deleteChecked: false
        // },
      ],
      disabledSave: false
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
    async get_role() {
      try {
        let res = await this.$axios.get(`/roles/${this.$route.params.id}`)
        this.role = res.data.data
        this.rolesBody.forEach((role) => {
          this.role.permissions.forEach((item) => {
            if(role.readId == item.id) {
              role.readChecked = true
            }
            if(role.createId == item.id) {
              role.createChecked = true
            }
            if(role.updateId == item.id) {
              role.updateChecked = true
            }
            if(role.deleteId == item.id) {
              role.deleteChecked = true
            }
          })
        })
      } catch(err) {
        console.log(err);
      }
    },
    async editRole() {
      let permissions = []
      this.rolesBody.forEach((item) => {
        if(item.readChecked) {
          permissions.push(item.readId)
        }
        if(item.createChecked) {
          permissions.push(item.createId)
        }
        if(item.updateChecked) {
          permissions.push(item.updateId)
        }
        if(item.deleteChecked) {
          permissions.push(item.deleteId)
        }
      })
      if(!this.disabledSave) {
        this.disabledSave = true
        try {
          this.loading_alert() /* Открываем загрузечное модальное окно */
          let res = await this.$axios.put(`/roles/${this.role.id}`, {permissions: permissions}) /* Сам запрос */
          localStorage.setItem('permissions', JSON.stringify(res.data.data.permissions))
          let payload = {
            key: 'permissions',
            body: res.data.data.permissions
          }
          this.change_state(payload)
          this.success_alert() /* Открываем успешное модальное окно */
          this.$router.push('/roles') /* Направляем на страницу ролей */
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
    if(!this.checkPermission('update-roles')) {
      this.$router.back(-1)
    }
  },
  mounted() {
    this.get_role()
  }
}
</script>
