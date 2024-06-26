declare namespace AdminType {
  interface Log {
    id?: number;
    uid?: number;
    requestId?: string;
    ip?: string;
    userAgent?: string;
    headers?: string;
    url?: string;
    method?: string;
    cookies?: string;
    params?: string;
    result?: string;
    httpCode?: number;
    cost?: number;
    createTime?: Date;
    updateTime?: Date;
  }

  interface LogQueryRequest extends PageRequest {
    id?: number;
    uid?: number;
    requestId?: string;
    ip?: string;
    userAgent?: string;
    url?: string;
    method?: string;
    cookies?: string;
    params?: string;
    result?: string;
    httpCode?: number;
    cost?: number;
    createTime?: Date;
    updateTime?: Date;
  }

  interface UserQueryRequest extends PageRequest {
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

  interface PermissionQueryRequest extends PageRequest {
    id?: number;
    uid?: number;
    permission?: string;
    expiry?: number;
    createTime?: Date;
    updateTime?: Date;
  }

  interface PermissionAddRequest {
    uid: number;
    permission: string;
    expiry: number;
  }

  interface PermissionUpdateRequest {
    id: number;
    permission: string;
    expiry: number;
  }

  interface AddBlacklistRequest {
    log: number;
    reason: string;
  }

  interface ChartRequest {
    type: string;
    days: number;
  }

  interface BlacklistQueryRequest extends PageRequest {
    id?: number;
    ip?: string;
    createTime?: Date;
    updateTime?: Date;
  }
}