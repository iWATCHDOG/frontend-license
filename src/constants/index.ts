export const DEFAULT_NAME = 'License';

export const isDev = process.env.NODE_ENV === 'development';

export const BASE_URL = isDev ? 'http://localhost:8102' : 'http://localhost:8102';

export const WS_URL = isDev ? 'ws://localhost:8102' : 'ws://localhost:8102';