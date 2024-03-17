import { request } from '@umijs/max';
import { RcFile } from 'antd/es/upload';
// @ts-ignore
import { BaseResponse, PageInfo } from '@/global';

/**
 * 获取当前登录用户
 */
export async function getLoginUser() {
  return request<BaseResponse<UserType.UserVO>>('/user/get/login', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
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
      'time': new Date().getTime(),
    },
  });
}

/**
 * 用户登录
 */
export async function userLogin(params: UserType.UserLoginRequest, res: RootType.CaptchaResult) {
  return request<BaseResponse<UserType.UserVO>>('/user/login', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'captcha': JSON.stringify(res),
      'time': new Date().getTime(),
    },
    params: params,
  });
}

export async function userLoginByToken(token: string) {
  return request<BaseResponse<UserType.UserVO>>('/user/login/token', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'loginToken': token,
      'time': new Date().getTime(),
    },
  });
}

/**
 * 邮箱验证码请求
 */
export async function emailCodeRequest(email: string, res: RootType.CaptchaResult) {
  return request<BaseResponse<boolean>>('/user/create/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'captcha': JSON.stringify(res),
      'time': new Date().getTime(),
    },
    params: { email },
  });
}

/**
 * 用户注册
 */
export async function userRegister(params: UserType.UserCreateRequest, res: RootType.CaptchaResult) {
  return request<BaseResponse<UserType.UserVO>>('/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'captcha': JSON.stringify(res),
      'time': new Date().getTime(),
    },
    params: params,
  });
}

/**
 * 邮箱找回
 */
export async function emailForget(email: string, res: RootType.CaptchaResult) {
  return request<BaseResponse<boolean>>('/user/forget/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'captcha': JSON.stringify(res),
      'time': new Date().getTime(),
    },
    params: { email },
  });
}

/**
 * 检查token
 */
export async function checkForgetPasswordToken(token: string) {
  return request<BaseResponse<boolean>>('/user/check/forget', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: { token },
  });
}

/**
 * 重置密码
 */
export async function forgetPasswordB(password: string, token: string, res: RootType.CaptchaResult) {
  return request<BaseResponse<boolean>>('/user/forget/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'forgetToken': token,
      'captcha': JSON.stringify(res),
      'time': new Date().getTime(),
    },
    params: { password },
  });
}

/**
 * 更新用户资料
 */
export async function updateUserProfile(params: UserType.UpdateUserProfileRequest) {
  return request<BaseResponse<boolean>>('/user/update/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: params,
  });
}

/**
 * 更新用户头像
 */
export async function updateUserAvatar(avatar: RcFile) {
  const formData = new FormData();
  formData.append('avatar', avatar);
  return request<BaseResponse<boolean>>('/user/upload/avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    data: formData,
  });
}

/**
 * 更新用户密码
 */
export async function updateUserPassword(params: UserType.UpdateUserPasswordRequest) {
  return request<BaseResponse<boolean>>('/user/update/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: params,
  });
}

/**
 * 注销用户
 */
export async function deleteUser() {
  return request<BaseResponse<boolean>>('/user', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function getOAuthInfo(type: number) {
  return request<BaseResponse<string>>('/oauth/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: { type },
  });
}

export async function unBindOAuth(type: number) {
  return request<BaseResponse<boolean>>('/oauth/unbind', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: { type },
  });
}

export async function bindOAuth(type: number) {
  return request<BaseResponse<string>>('/oauth/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: { type },
  });
}

export async function getSecurityLogs(params: UserType.UserSecurityLogQueryRequest) {
  return request<BaseResponse<PageInfo<UserType.SecurityLogVO[]>>>('/user/security/log', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: params,
  });
}

export async function getUsername(uid: number) {
  return request<BaseResponse<string>>('/user/get/username/' + uid, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function getUserProfile(uid: number) {
  return request<BaseResponse<UserType.UserVO>>('/user/get/profile/' + uid, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function getUserProfileByUsername(username: string) {
  return request<BaseResponse<UserType.UserVO>>('/user/get/profile/username/' + username, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}