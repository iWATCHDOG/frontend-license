/**
 * 路由
 * 配置参考：https://umijs.org/docs/max/layout-menu#%E6%89%A9%E5%B1%95%E7%9A%84%E8%B7%AF%E7%94%B1%E9%85%8D%E7%BD%AE
 */
export default [{
  name: '主页',
  path: '/',
  component: 'index',
}, {
  name: '用户协议',
  path: '/agreement',
  component: 'agreement',
}, {
  path: '/user',
  hideInMenu: true,
  routes: [{
    name: '用户登录',
    path: '/user/login',
    component: 'user/login',
  }, {
    name: '忘记密码',
    path: '/user/forget',
    component: 'user/forget',
  }, {
    name: '忘记密码',
    path: '/user/forget/:token',
    component: 'user/forget',
  }, {
    name: '用户注册',
    path: '/user/register',
    component: 'user/register',
  }, {
    name: '设置',
    access: 'canUser',
    path: '/user/settings',
    component: 'user/settings',
  }, {
    name: '设置',
    access: 'canUser',
    path: '/user/settings/:type',
    component: 'user/settings',
  }],
}, {
  name: '404',
  path: '/*',
  component: '@/pages/404.tsx',
  hideInMenu: true,
}];