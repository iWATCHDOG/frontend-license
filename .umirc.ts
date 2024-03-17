import { defineConfig } from '@umijs/max';
import routes from './src/configs/routes';

export default defineConfig({
  antd: {
    // configProvider
    configProvider: {},
    dark: false,
    // less or css, default less
    style: 'less',
    // shortcut of `configProvider.theme`
    // use to configure theme token, antd v5 only
    theme: {},
    // antd <App /> valid for version 5.1.0 or higher, default: undefined
    appConfig: {},
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

