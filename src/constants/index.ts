export const DEFAULT_NAME = 'License';

export const isDev = process.env.NODE_ENV === 'development';

export const BASE_URL = isDev ? 'http://localhost:8102' : 'http://192.168.2.1:8102';
// 190249560
export const TENCENT_CAPTCHA_APP_ID = '190231925';