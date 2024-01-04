import { request } from '@@/exports';

export async function countUser() {
  return request<BaseResponse<number>>('/admin/count/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function countLog() {
  return request<BaseResponse<number>>('/admin/count/log', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function countSecurityLog() {
  return request<BaseResponse<number>>('/admin/count/security', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getLogs(params: AdminType.LogQueryRequest) {
  return request<BaseResponse<PageInfo<AdminType.Log[]>>>('/admin/log/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params,
  });
}

export async function getUsers(params: AdminType.UserQueryRequest) {
  return request<BaseResponse<UserType.UserVO[]>>('/admin/user/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params,
  });

}

export async function getLogByRequestID(requestId: string) {
  return request<BaseResponse<AdminType.Log>>(`/admin/log/` + requestId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteUser(uid: number) {
  return request<BaseResponse<any>>(`/admin/user/` + uid, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}