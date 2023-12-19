import { RequestConfig } from '@@/plugin-request/request';
import { RunTimeLayoutConfig } from '@@/plugin-layout/types';
import { BASE_URL, DEFAULT_NAME } from '@/constants';
import { getLoginUser, getLoginUserMaxGroup, userLoginByToken } from '@/services/userService';
import GlobalFooter from '@/components/GlobalFooter';
import RightContent from '@/components/GlobalHeader/RightContent';


function getCookie(name: string) {
  let cookieArr = document.cookie.split('; ');
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split('=');
    if (name === cookiePair[0]) {
      return cookiePair[1];
    }
  }
  return null;
}

// 运行时配置
/**
 * 全局初始化数据配置，用于 Layout 用户信息和权限初始化
 * 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
 */
export async function getInitialState(): Promise<InitialState> {
  const defaultState: InitialState = {
    loginUser: undefined,
    group: undefined,
  };

  function refreshToken(token?: string) {
    // 刷新cookie
    let date = new Date();
    date.setDate(date.getDate() + 7);
    document.cookie = `loginToken=${token}; expires=${date.toUTCString()};`;
  }

  // 获取当前登录用户
  try {
    const res = await getLoginUser();
    defaultState.loginUser = res.data;
    refreshToken(res.data.token);
  } catch (e) {
    // 未登录时
    const token = getCookie('loginToken');
    if (token) {
      // 有cookie，进行cookie登录
      try {
        const res = await userLoginByToken(token);
        defaultState.loginUser = res.data;
        refreshToken(res.data.token);
      } catch (e) {
      }
    }
  }
  try {
    const per = await getLoginUserMaxGroup();
    defaultState.group = per.data;
  } catch (ignore) {

  }
  return defaultState;
}

/**
 * 全局布局配置
 */
export const layout: RunTimeLayoutConfig = () => {
  return {
    title: DEFAULT_NAME,
    logo: null,
    menu: {
      locale: true,
    },
    fixedHeader: true,
    layout: 'top',
    contentStyle: {
      paddingBottom: 120,
    },
    rightContentRender: () => <RightContent />,
    footerRender: () => <GlobalFooter />,
  };
};

/**
 * 全局请求配置
 * https://umijs.org/docs/max/request
 */
export const request: RequestConfig = {
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // other axios options you want
  requestInterceptors: [],
  responseInterceptors: [(response) => {
    // 不再需要异步处理读取返回体内容，可直接在 data 中读出，部分字段可在 config 中找到
    const data: any = response.data;
    const path = response.request.responseURL;
    if (!data) {
      throw new Error('服务异常');
    }
    // 获取requestId
    const requestId = data.requestInfo.requestId;
    const code = data.code ?? 50000;
    // 未登录，且不为获取用户登录信息接口
    if (code === 40100 && !path.includes('user/get/login') && !location.pathname.includes('/user/login')) {
      // 跳转至登录页
      // window.location.href = `/user/login?redirect=${window.location.href}`;
      throw new Error(`${data.message} 请求ID: ${requestId}`);
    }
    if (code !== 20000) {
      throw new Error(`${data.message} 请求ID: ${requestId}`);
    }
    /*if (code !== 0) {
      console.error(`request error, path = ${path}`, data);
      throw new Error(data.message ?? '服务器错误');
    }*/
    // do something
    return response;
  }],
};
