import { request } from '@umijs/max';
import { RcFile } from 'antd/es/upload';

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

/**
 * 检查token
 */
export async function checkForgetPasswordToken(token: string) {
  return request<BaseResponse<boolean>>('/user/check/forget', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { token },
  });
}

/**
 * 重置密码
 */
export async function forgetPasswordB(password: string, token: string) {
  return request<BaseResponse<boolean>>('/user/forget/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'forgetToken': token,
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
    },
    data: formData,
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
    },
  });
}