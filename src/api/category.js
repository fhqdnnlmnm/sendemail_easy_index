import request from '@/utils/request'

const baseUrl = '/v1/categories'

export default{
  getTreeList: function() {
    return request({
      url: baseUrl + '/tree_list',
      method: 'get',
      params: null
    })
  },
  store: function(query) {
    return request({
      url: baseUrl,
      method: 'post',
      params: query
    })
  },
  show: function(id) {
    return request({
      url: baseUrl + '/' + id,
      method: 'get',
      params: null
    })
  },
  update: function(query) {
    return request({
      url: baseUrl + '/' + query.id,
      method: 'put',
      params: query
    })
  },
  getParentList: function() {
    return request({
      url: baseUrl + '/getParentList',
      method: 'get',
      params: null
    })
  }
}
