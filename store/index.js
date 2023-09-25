
let permissions = localStorage.getItem('permissions')
permissions = JSON.parse(permissions)

export const state = () => ({
    permissions: permissions,
    MenuBtn: false,
    hiddenProfileButtons: false,
    closeModalBtn: true,
    showConfirmationModal: false, /* Переменная, отвечающая за скрытие и отображение модального окна потверждения действия */
    logout: { /* Переменая отвечающая за скрытие и отображение модального окно выхода с админки */
      isActive: false
    },
    isShowMediaFiles: false, /* Переменная, отвечающая за скрытие и отображение модального окна медиафайлов */
    isShowCardMediaFile: true, /* Переменная, отвечающая за скрытие и отображение модальной карточки медиафайла */
    isShowLocation: false, /* Переменная, отвечающая за скрытие и отображение модального кона выбора расположения публикации */
    activeList: [
      {
        id: 1,
        value: '1',
        title: 'Неактивный'
      },
      {
        id: 2,
        value: '2',
        title: 'Активный'
      },
    ],
    roleList: [
      {
        id: 1,
        value: '1',
        title: 'Администратор'
      },
      {
        id: 2,
        value: '2',
        title: 'Редактор'
      },
      {
        id: 3,
        value: '3',
        title: 'Автор'
      }
    ],
    statusList: [
      {
        id: 1,
        value: '',
        title: 'Все'
      },
      {
        id: 2,
        value: 'На модерации',
        title: 'На модерации'
      },
      {
        id: 3,
        value: 'Удалено',
        title: 'Удалено'
      },
      {
        id: 4,
        value: 'Активный',
        title: 'Активный'
      },
    ],
    langList: [ /* Список языков */
      {
        id: 1,
        text: 'Все',
        title: 'Все',
        code: ''
      },
      {
        id: 2,
        text: 'RU',
        title: 'Русский',
        code: 'ru'
      },
      {
        id: 3,
        text: 'TJ',
        title: 'Таджикский',
        code: 'tj'
      },
      {
        id: 4,
        text: 'EN',
        title: 'Английский',
        code: 'en'
      }
    ],
    // DATA FROM API
    tags: [],
    pages: [
      {
        id: 9,
        link: "/publications",
        icon: "publics",
        text: "Публикации",
        width: "18",
        height: "18",
        viewBox: "0 0 18 20",
      },
      // {
      //   id: 5,
      //   link: "/rubrics",
      //   icon: "rubrics",
      //   text: "Рубрики",
      //   width: "20",
      //   height: "17",
      //   viewBox: "0 0 20 17",
      // },
      {
        id: 41,
        link: "/poster",
        icon: "poster",
        text: "Афиша",
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
      },
      {
        id: 13,
        link: "/special-projects",
        icon: "special-projects",
        text: "Спецпроекты",
        width: "20",
        height: "18",
        viewBox: "0 0 20 18",
      },
      {
        id: 17,
        link: "/users",
        icon: "users",
        text: "Пользователи",
        width: "19",
        height: "23",
        viewBox: "0 0 19 23",
      },
      {
        id: 21,
        link: "/advertisement",
        icon: "advertisement",
        text: "Реклама",
        width: "20",
        height: "18",
        viewBox: "0 0 20 18",
      },
      {
        id: 25,
        link: "/comments",
        icon: "comments",
        text: "Комментарии",
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
      },
      {
        id: 29,
        link: "/media-files",
        icon: "media",
        text: "Медиафайлы",
        width: "20",
        height: "18",
        viewBox: "0 0 20 18",
      },
      {
        id: 33,
        link: "/history",
        icon: "history",
        text: "История",
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
      },
      {
        id: 49,
        link: "/roles",
        icon: "role",
        text: "Роли",
        width: "19",
        height: "22",
        viewBox: "0 0 19 22",
      },
      {
        id: 45,
        link: "/tags",
        icon: "tags",
        text: "Теги",
        width: "20",
        height: "18",
        viewBox: "0 0 20 18",
      },
      {
        id: 37,
        link: "/profile",
        icon: "profile",
        text: "Профиль",
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
      },
    ],
  })

  export const mutations = {
    CHANGE_STATE(state, payload) {
      state[payload.key] = payload.body
    },

    CHANGE_MODAL_ADDFILE(state, payload) {
      state.modals.addFile.isActive = payload
    },
    CHANGE_MODAL_ADDFILE_2(state, payload) {
      state.modals.addFile_2.isActive_2 = payload
    },
    menuOpen(state) {
        state.MenuBtn = true
    },
    menuClose(state) {
      state.MenuBtn = false
    },
    closeProfileButtons(state) {
      state.hiddenProfileButtons = true
    },
    closeProfileButtonsFalse(state) {
      state.hiddenProfileButtons = false
    },

    // DATA FROM API
    SET_TAGS(state, tags) {
      state.tags = tags
    },
  }

  export const getters = {
    getTags(state) {
      return state.tags
    },
    filtrPages(state) {
      let filtrPages = []
      state.pages.forEach((page) => {
        state.permissions.forEach((item) => {
          if(item.id == page.id) {
            filtrPages.push(page)
          }
        })
      })
      return filtrPages
    },
  }



  export const actions = {
    async fetchTags({ commit }) {
      const response = await this.$axios.get('http://api.your.colibri.tj/api/tags')
      const tags = response.data.data
      commit('SET_TAGS', tags)
    },
  }
