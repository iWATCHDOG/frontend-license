import { defineConfig } from '@umijs/max';
import routes from './src/configs/routes';

export default defineConfig({
  antd: {
    // Add StyleProvider for legacy browsers
    styleProvider: {
      hashPriority: 'high',
      legacyTransformer: true,
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes,
  /*proxy: {
    '/api': {
      'target': 'https://backend.floracore.cc/',
      'changeOrigin': true,
      'pathRewrite': { '^/api': '' },
    },
  },*/
  fastRefresh: true,
  npmClient: 'pnpm',
  headScripts: [
    { src: 'https://turing.captcha.qcloud.com/TCaptcha.js' },
  ],
  // 这一部分是配置 子目录 的
  /*publicPath: '/license/',
  runtimePublicPath: {},
  qiankun: {
    slave: {},
  },*/
});

