declare namespace AdminType {
  interface Log {
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
}