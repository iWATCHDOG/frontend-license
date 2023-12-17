import { request } from '@umijs/max';

/**
 * 获取当前登录用户
 */
export async function getLoginUser() {
  return request<BaseResponse<UserType.UserVO>>('/user/get/login', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 获取当前登录用户最大权限组
 */
export async function getLoginUserMaxGroup() {
  return request<BaseResponse<Permission.Permission>>('/user/get/group/max', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 用户注销
 */
export async function userLogout() {
  return request<BaseResponse<boolean>>('/user/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 用户登录
 */
export async function userLogin(params: UserType.UserLoginRequest) {
  return request<BaseResponse<UserType.UserVO>>('/user/login', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params,
  });
}

/**
 * 邮箱验证码请求
 */
export async function emailCodeRequest(email: string) {
  return request<BaseResponse<boolean>>('/user/create/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { email },
  });
}

/**
 * 用户注册
 */
export async function userRegister(params: UserType.UserCreateRequest) {
  return request<BaseResponse<number>>('/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params,
  });
}

/**
 * 邮箱找回
 */
export async function emailForget(email: string) {
  return request<BaseResponse<boolean>>('/user/forget/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { email },
  });
}