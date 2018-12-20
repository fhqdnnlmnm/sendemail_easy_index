import emailSenderAPI from '@/api/emailSender'
const state = {
  emailSenderList: [],
  emailSenderListLoadStatus: 0
}
const getters = {
  emailSenderList: (state) => {
    return state.emailSenderList
  },
  emailSenderListLoadStatus: (state) => {
    return state.emailSenderListLoadStatus
  }
}
const actions = {
  getEmailSenderList({ commit, dispatch, state }) {
    commit('SET_EMAIL_SENDER_LIST_STATUS', 1)
    emailSenderAPI.index()
      .then((response) => {
        commit('SET_EMAIL_SENDER_LIST', response.data)
        commit('SET_EMAIL_SENDER_LIST_STATUS', 2)
      })
      .catch(() => {
        commit('SET_EMAIL_SENDER_LIST', [])
        commit('SET_EMAIL_SENDER_LIST_STATUS', 3)
      })
  },
  addEmailSender({ commit, state, dispatch }, data) {
    return new Promise((resolve, reject) => {
      emailSenderAPI.store(data).then(() => {
        dispatch('getEmailSenderList')
        resolve()
      })
    })
  },
  destroyEmailSender({ commit, dispatch }, id) {
    return new Promise((resolve, reject) => {
      emailSenderAPI.destroy(id).then(() => {
        dispatch('getEmailSenderList')
        resolve()
      })
    })
  },
  updateEmailSender({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      emailSenderAPI.update(data).then(() => {
        dispatch('getEmailSenderList')
        resolve()
      })
    })
  }
}
const mutations = {
  SET_EMAIL_SENDER_LIST: (state, data) => {
    state.emailSenderList = data
  },
  SET_EMAIL_SENDER_LIST_STATUS: (state, status) => {
    state.emailSenderListLoadStatus = status
  }

}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
