import CustomerAPI from '@/api/customer'
const state = {
  customers: [],
  customersLoadStatus: 0,
  countries: []
}
const getters = {
  customers: (state) => {
    return state.customers
  },
  customersLoadStatus: (state) => {
    return state.customersLoadStatus
  },
  countries: (state) => {
    return state.countries
  }
}
const actions = {
  getCustomers(context, query) {
    context.commit('SET_CUSTOMERS_LOAD_STATUS', 1)
    CustomerAPI.index(query)
      .then((response) => {
        context.commit('SET_CUSTOMERS', response.data.data)
        context.commit('SET_CUSTOMERS_LOAD_STATUS', 2)
      })
      .catch(() => {
        context.commit('SET_CUSTOMERS_LOAD_STATUS', 3)
      })
  },
  addCustomer({ commit, state, dispatch }, data) {
    return new Promise((resolve, reject) => {
      CustomerAPI.store(data).then(() => {
        dispatch('getCustomers')
        dispatch('getCountries')
        resolve()
      })
        .catch(() => {
          reject()
        })
    })
  },
  updateCustomer({ commit, state, dispatch }, data) {
    commit('SET_CUSTOMERS_LOAD_STATUS', 1)
    return new Promise((resolve, reject) => {
      CustomerAPI.update(data).then((response) => {
        dispatch('getCustomers')
        commit('SET_CUSTOMERS_LOAD_STATUS', 2)
        resolve()
      }).catch(function() {
        commit('SET_CUSTOMERS_LOAD_STATUS', 3)
        reject()
      })
    })
  },
  destroyCustomer({ commit, state, dispatch }, id) {
    return new Promise((resolve, reject) => {
      CustomerAPI.destory(id)
        .then(function() {
          dispatch('getCustomers')
          resolve()
        })
        .catch(function() {
          reject()
        })
    })
  },
  getCountries({ commit }) {
    CustomerAPI.getCountries()
      .then((response) => {
        commit('SET_COUNTRIES', response.data)
      }).catch(() => {

      })
  }
}
const mutations = {
  SET_CUSTOMERS(state, data) {
    state.customers = data
  },
  SET_CUSTOMERS_LOAD_STATUS(state, status) {
    state.customersLoadStatus = status
  },
  SET_COUNTRIES(state, data) {
    // console.log(data)
    state.countries = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
