/**
 * 用户类型定义
 */
declare namespace UserType {
  /**
   * 实体
   */
  interface User {
    uid?: number;
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    gender?: number;
    avatar?: string;
    status?: number;
    createTime?: Date;
    updateTime?: Date;
  }

  interface UserVO {
    uid?: number;
    username?: string;
    email?: string;
    phone?: string;
    gender?: number;
    avatar?: string;
    status?: number;
    token?: string;
    group?: Permission.Permission;
    createTime?: Date;
    updateTime?: Date;
  }

  interface OAuthInfo {
    type: number;
    openId?: string;
  }

  /**
   * 用户登录请求
   */
  interface UserLoginRequest {
    account: string;
    password: string;
    agreement: string;
  }

  interface UserCreateRequest {
    username: string;
    password: string;
    email?: string;
    phone?: string;
    code: string;
  }

  interface UpdateUserProfileRequest {
    username?: string;
    gender?: number;
  }

  interface UpdateUserPasswordRequest {
    oldPassword: string;
    newPassword: string;
  }

  interface SecurityLog {
    id?: number;
    uid?: number;
    avatar?: string;
    title?: string;
    types?: string;
    ip?: string;
    info?: string;
    createTime?: Date;
    updateTime?: Date;
  }

  interface SecurityLogVO {
    id?: number;
    uid?: number;
    avatar?: Avatar;
    title?: string;
    types?: string;
    ip?: string;
    info?: string;
    createTime?: Date;
    updateTime?: Date;
  }

  interface Avatar {
    avatars: AvatarData[];
  }

  interface AvatarData {
    code: number;
    data: object;
  }

  interface UserSecurityLogQueryRequest extends PageRequest {
    id?: number;
    uid?: number;
    title?: string;
    types?: string;
    ip?: string;
    info?: string;
    createTime?: Date;
    updateTime?: Date;
  }
}
