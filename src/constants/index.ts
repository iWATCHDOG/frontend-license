export const DEFAULT_NAME = 'License';

export const isDev = process.env.NODE_ENV === 'development';

export const BASE_URL = isDev ? 'http://localhost:8102' : 'http://localhost:8102';