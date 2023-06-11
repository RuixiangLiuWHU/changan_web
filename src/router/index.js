/*
 * @Author: your name
 * @Date: 2021-09-26 15:16:46
 * @LastEditTime: 2022-04-27 15:36:59
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Changan University\src\router\index.js
 */
import Vue from 'vue'
import Home from '../components/Home'
import Router from 'vue-router'
import Database from '../components/Database'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

Vue.use(Router)

export default new Router({
  // base: '/SISPET',
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/home'
    }, {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/database',
      name: 'database',
      component: Database,
    },
  ]
})