import emailTemplateAPI from '@/api/emailTemplate'
const state = {
  templateList: [],
  templateListLoadStatus: 0
}
const getters = {
  templateList: (state) => {
    return state.templateList
  },
  templateListLoadStatus: (state) => {
    return state.templateListLoadStatus
  }
}
const actions = {
  getTemplateList({ commit }) {
    commit('SET_TEMPLATE_LOAD_STATUS', 1)
    emailTemplateAPI.index().then((response) => {
      commit('SET_TEMPLATE_LOAD_STATUS', 2)
      commit('SET_TEMPLATE_LIST', response.data)
    })
  },
  addTemplate({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      emailTemplateAPI.store(data).then((response) => {
        dispatch('getTemplateList')
        resolve()
      })
        .catch(() => {
          reject()
        })
    })
  },
  updateTemplate({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      emailTemplateAPI.update(data).then(() => {
        dispatch('getTemplateList')
        resolve()
      })
    })
  },
  destroyTemplate({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      emailTemplateAPI.destroy(data).then(() => {
        dispatch('getTemplateList')
        resolve()
      })
    })
  }
}

const mutations = {
  SET_TEMPLATE_LOAD_STATUS: (state, status) => {
    state.templateListLoadStatus = status
  },
  SET_TEMPLATE_LIST: (state, data) => {
    state.templateList = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
