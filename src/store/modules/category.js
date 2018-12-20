import CategoryAPI from '@/api/category'

const state = {
  list: [],
  listLoadStatus: 0,

  treeList: [],
  treeListLoadStatus: 0,

  parentList: [],
  parentListLoadStatus: 0
}

const getters = {
  list: (state) => {
    return state.list
  },
  treeList: (state) => {
    return state.treeList
  },
  parentList: (state) => {
    return state.parentList
  },
  subList: (state) => (parent_id) => {
    return state.list.filter(list => list.parent_id === parent_id)
  },
  categoryInfo: (state) => (data) => {
    const subCategory = state.list.find(category => category.id === data.id)
    if (data.parent_id === 0) {
      return '顶级' + '-' + subCategory.name
    }
    const parentCategory = state.list.find(category => category.id === data.parent_id)
    return parentCategory.name + '-' + subCategory.name
  }
}

const actions = {
  getList(context) {
    context.commit('SET_LIST_LOAD_STATUS', 1)
    CategoryAPI.index()
      .then((response) => {
        context.commit('SET_LIST', response.data.data)
        context.commit('SET_LIST_LOAD_STATUS', 2)
      })
      .catch(() => {
        context.commit('SET_LIST', [])
        context.commit('SET_LIST_LOAD_STATUS', 3)
      })
  },
  getTreeList(context) {
    context.commit('SET_TREE_LIST_LOAD_STATUS', 1)
    CategoryAPI.getTreeList()
      .then((response) => {
        context.commit('SET_TREE_LIST', response.data)
        context.commit('SET_TREE_LIST_LOAD_STATUS', 2)
      })
      .catch(() => {
        context.commit('SET_TREE_LIST', [])
        context.commit('SET_TREE_LIST_LOAD_STATUS', 3)
      })
  },
  getParentList(context) {
    context.commit('SET_TREE_LIST_LOAD_STATUS', 1)
    CategoryAPI.getParentList()
      .then((response) => {
        const data = response.data.data
        data.unshift({
          'id': 0,
          'parent_id': 0,
          'name': '顶级父类'
        })
        context.commit('SET_PARENT_LIST', data)
        context.commit('SET_PARENT_LIST_LOAD_STATUS', 2)
      })
      .catch(() => {
        context.commit('SET_PARENT_LIST', [])
        context.commit('SET_PARENT_LIST_LOAD_STATUS', 3)
      })
  },
  addCategory({ commit, state, dispatch }, data) {
    // commit('setCafeAddStatus',1);
    return new Promise((resolve, reject) => {
      CategoryAPI.store(data)
        .then(function(response) {
          // commit('setCafeAddStatus', 2);
          dispatch('getTreeList')
          dispatch('getParentList')
          resolve()
        })
        .catch(function() {
          reject()
          // commit('setCafeAddStatus', 3);
        })
    })
  },
  updateCategory({ commit, state, dispatch }, data) {
    return new Promise((resolve, reject) => {
      CategoryAPI.update(data)
        .then(function(response) {
          dispatch('getTreeList')
          dispatch('getParentList')
          resolve()
        })
        .catch(function() {
          reject()
          // commit('setCafeAddStatus', 3);
        })
    })
  },
  destoryCategory({ commit, state, dispatch }, id) {
    return new Promise((resolve, reject) => {
      CategoryAPI.destroy(id)
        .then(function() {
          dispatch('getTreeList')
          dispatch('getParentList')
          resolve()
        })
        .catch(function() {
          reject()
        })
    })
  }
}

const mutations = {
  SET_TREE_LIST: (state, data) => {
    state.treeList = data
  },
  SET_TREE_LIST_LOAD_STATUS: (state, status) => {
    state.treeListLoadStatus = status
  },
  SET_PARENT_LIST: (state, data) => {
    state.parentList = data
  },
  SET_PARENT_LIST_LOAD_STATUS: (state, status) => {
    state.parentListLoadStatus = status
  },
  SET_LIST: (state, data) => {
    state.list = data
  },
  SET_LIST_LOAD_STATUS: (state, status) => {
    state.listLoadStatus = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
