/*
 * @Author: your name
 * @Date: 2021-09-26 15:16:46
 * @LastEditTime: 2024-08-02 10:00:59
 * @LastEditors: RuixiangLiuWHU lrx_lucky@whu.edu.cn
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
  base: '/SISPET', //build的时候要打开注释，serve的时候要关闭注释
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