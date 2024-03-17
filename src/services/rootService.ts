import { request } from '@@/exports';
// @ts-ignore
import { BaseResponse } from '@/global';

export async function getPing() {
  return request<BaseResponse<string>>('/ping', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function getNotifyList() {
  return request<BaseResponse<RootType.NotifyResponse[]>>('/notify', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
  });
}

export async function postNotify(params: RootType.NotifyRequest) {
  return request<BaseResponse<RootType.NotifyResponse>>('/notify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'time': new Date().getTime(),
    },
    params: params,
  });
}