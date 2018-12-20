import request from '@/utils/request'
const baseUrl = '/v1/customers'
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
  destory: function(id) {
    return request({
      url: baseUrl + '/' + id,
      method: 'delete'
    })
  },
  getCountries: function() {
    return request({
      url: baseUrl + '/getCountries',
      method: 'get'
    })
  }
}
