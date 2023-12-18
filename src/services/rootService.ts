import { request } from '@@/exports';

export async function getPing() {
  return request<BaseResponse<string>>('/ping', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}