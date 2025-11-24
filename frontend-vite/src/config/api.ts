// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8050';

export const API_ENDPOINTS = {
  LOGIN: '/log_in',
  REGISTER: '/register',
  CLEAR_TOKEN: '/clear_tk',
  VALIDATE_TOKEN: '/validate_token',
  GET_ROOMS: '/get_rooms',
  CREATE_ROOM: '/create_room',
} as const;

