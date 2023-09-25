export const state = () => ({
  alert: {
    isActive: false,
    type: '',
    msg: ''
  }
})

export const mutations = {
  LOADING_ALERT(state) {
    state.alert = {
      isActive: true,
      type: '',
      msg: 'Идет загрузка, подождите...'
    }
  },
  SUCCESS_ALERT(state) {
    state.alert = {
      isActive : true,
      type: 'success',
      msg: 'Успешно выполнено!'
    }
  },
  ERROR_ALERT(state, payload) {
    state.alert = {
      isActive: true,
      type: 'error',
      msg: payload
    }
  },
  CLEAR_ALERT(state) {
    state.alert = {
      isActive: false,
      type: '',
      msg: ''
    }
  }
}

export const getters = {
}

export const actions = {
  success_alert({commit}) {
    commit('SUCCESS_ALERT')
    setTimeout(() => {
      commit('CLEAR_ALERT')
    }, 2000)
  },
  error_alert({commit}, payload) {
    commit('ERROR_ALERT', payload)
    setTimeout(() => {
      commit('CLEAR_ALERT')
    }, 2000)
  },
}
