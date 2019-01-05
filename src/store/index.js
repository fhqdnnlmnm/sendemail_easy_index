import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import category from './modules/category'
import customer from './modules/customer'
import emailSender from './modules/emailSender'
import emailTemplate from './modules/emailTemplate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    category,
    customer,
    emailSender,
    emailTemplate
  },
  getters
})

export default store
