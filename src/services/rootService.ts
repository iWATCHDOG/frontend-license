import { request } from '@@/exports';

export async function getPing() {
  return request<BaseResponse<string>>('/ping', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getNotifyList() {
  return request<BaseResponse<RootType.NotifyResponse[]>>('/notify', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function postNotify(params: RootType.NotifyRequest) {
  return request<BaseResponse<RootType.NotifyResponse>>('/notify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params,
  });
}