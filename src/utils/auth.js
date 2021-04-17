// import Cookies from 'js-cookie'
// import Layout from '@/layout'
// import Second from '@/views/second'

const TokenKey = 'admin_token'
// 设置过期时间(6小时)
const inHalfADay = new Date(new Date().getTime() + 6 * 60 * 60 * 1000)

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { expires: inHalfADay })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 遍历后台传来的路由字符串，转换为组件对象
export function filterAsyncRouter (asyncRouterMap) {
  let accessedRouters = []
  for (const route of asyncRouterMap) {
    let list = {}
    // 主菜单
    if (route.component === 'Layout') {
      list.component = Layout
      if (route.redirect) {
        list.redirect = route.redirect
      }
      // 二级菜单
    } else if (route.component === 'Second') {
      list.component = Second
      if (route.redirect) {
        list.redirect = route.redirect
      }
    } else {
      // const str = route.href.replace(route.href[0], route.href[0].toUpperCase())
      // list.component = require(`@/views${route.component}`)
      list.component = (resolve) => require([`@/views${route.component}`], resolve)
    }
    list.meta = { title: route.title, icon: route.icon }
    list.name = route.name
    list.path = route.href
    list.hidden = route.hidden === 0
    if (route.children && route.children.length) {
      list.children = filterAsyncRouter(route.children)
    }
    accessedRouters.push(list)
  }
  // 其他页面添加好了才能放404页面
  // accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
  return accessedRouters
}
