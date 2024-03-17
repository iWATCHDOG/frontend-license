import { request } from '@@/exports';
// @ts-ignore
import { BaseResponse, PageInfo } from '@/global';

export async function countUser() {
  return request<BaseResponse<number>>('/admin/count/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function countLog() {
  return request<BaseResponse<number>>('/admin/count/log', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function countBlacklist() {
  return request<BaseResponse<number>>('/admin/count/blacklist', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function countSecurityLog() {
  return request<BaseResponse<number>>('/admin/count/security', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function getLogs(params: AdminType.LogQueryRequest) {
  return request<BaseResponse<PageInfo<AdminType.Log[]>>>('/admin/log/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: params,
  });
}

export async function getUsers(params: AdminType.UserQueryRequest) {
  return request<BaseResponse<UserType.UserVO[]>>('/admin/user/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: params,
  });
}

export async function getPermissions(params: AdminType.PermissionQueryRequest) {
  return request<BaseResponse<Permission.PermissionVO[]>>('/admin/permission/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: params,
  });

}

export async function getLogByRequestID(requestId: string) {
  return request<BaseResponse<AdminType.Log>>(`/admin/log/` + requestId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function deleteUser(uid: number) {
  return request<BaseResponse<any>>(`/admin/user/` + uid, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function addPermission(params: AdminType.PermissionAddRequest) {
  return request<BaseResponse<any>>(`/admin/permission/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: params,
  });
}

export async function deletePermission(id: number) {
  return request<BaseResponse<any>>(`/admin/permission/` + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function updatePermission(params: AdminType.PermissionUpdateRequest) {
  return request<BaseResponse<any>>(`/admin/permission/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: params,
  });
}

export async function addBlacklist(id: number) {
  return request<BaseResponse<any>>(`/admin/blacklist/` + id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}