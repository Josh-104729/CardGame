// API Configuration
export const API_BASE_URL = 'http://172.20.1.144:8050';
export const SOCKET_URL = 'http://172.20.1.144:8050';

export const API_ENDPOINTS = {
  LOGIN: '/log_in',
  REGISTER: '/register',
  CLEAR_TOKEN: '/clear_tk',
  VALIDATE_TOKEN: '/validate_token',
  GET_ROOMS: '/get_rooms',
  CREATE_ROOM: '/create_room',
} as const;

