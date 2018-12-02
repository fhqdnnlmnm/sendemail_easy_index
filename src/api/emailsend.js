import request from '@/utils/request'

export function companies(query) {
  return request({
    url: '/v1/companies',
    method: 'get',
    params: query
  })
}

export function cats() {
  return request({
    url: '/v1/catsList',
    method: 'get'
  })
}

export function catsTreeList() {
  return request({
    url: '/v1/catsTreeList',
    method: 'get'
  })
}

export function senderList() {
  return request({
    url: '/v1/senderList',
    method: 'get'
  })
}

export function emailList() {
  return request({
    url: '/v1/emailList',
    method: 'get'
  })
}

// 获取所有邮件模板列表
export function emailTemList() {
  return request({
    url: '/v1/emailTemList',
    method: 'get'
  })
}

// 获取所有公司已经存在的国家列表
export function countryList() {
  return request({
    url: '/v1/countries',
    method: 'get'
  })
}

// 创建公司
export function createCompany(query) {
  return request({
    url: '/v1/companies',
    method: 'post',
    params: query
  })
}

// 更新公司信息
export function updataCompany(query) {
  return request({
    url: '/v1/companies',
    method: 'put',
    params: query
  })
}

// 删除公司
export function deleteCompany(query) {
  return request({
    url: '/v1/companies',
    method: 'delete',
    params: query
  })
}
