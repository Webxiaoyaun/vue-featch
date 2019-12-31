import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {on as serviceOn} from "./services"
import Loading from './lib/loading.js'
import * as api from "./api/api";
import "./lib/rem.js"
import {message} from "ant-design-vue"

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$message = message;
Vue.use(Loading)
const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/** 处理请求前、请求后、请求报错的情况 **/

let globalLoading = null
let globalLoadingCount = 0

serviceOn('willRequest', (option) => {
    if (!option.loading) {
        return
    }
    globalLoadingCount++
    if (globalLoading) {
        return
    }
    app.$loading.show()
})

serviceOn('requested', (option) => {
    if (!option.loading) {
        return
    }

    globalLoadingCount--
    if (globalLoadingCount > 0) {
        return
    }
    app.$loading.hide()
    globalLoading = null
})

serviceOn('error', (err) => {
    let str = '发生错误: ' + JSON.stringify(err)
    if (err && err.msg) {
        if (err.code === -99) {
            str = `您输入的【${err.msg}】属于敏感词，请修改再提交`
        } else {
            str = err.msg
        }
    } else if (typeof err === 'string') {
        str = err
    } else if (err instanceof Error) {
        str = err.message
    }
    app.$message.warning(str);
})