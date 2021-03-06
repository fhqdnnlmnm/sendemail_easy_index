import request from '@/utils/request'

const baseUrl = '/v1/categories'

export default{
  index: function(query) {
    return request({
      url: baseUrl,
      method: 'get',
      params: query
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
  destroy: function(query) {
    return request({
      url: baseUrl + '/' + query.id,
      method: 'delete'
    })
  },
  getParentList: function() {
    return request({
      url: baseUrl + '/getParentList',
      method: 'get',
      params: null
    })
  },
  getTreeList: function() {
    return request({
      url: baseUrl + '/getTreeList',
      method: 'get',
      params: null
    })
  }
}
