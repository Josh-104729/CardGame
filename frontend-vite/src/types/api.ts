// Request Types
export interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface RegisterRequest {
  Name: string;
  UserName: string;
  Password: string;
  BirthDay: string;
  Gender: string;
  AllowedByAdmin: number;
  Email: string;
  AvatarUrl: string;
}

export interface ClearTokenRequest {
  UserName: string;
}

export interface ValidateTokenRequest {
  token: string;
}

// Response Types
export interface ApiResponse {
  variant?: string;
  msg?: string;
  status?: number;
  [key: string]: any;
}

export interface LoginResponse extends ApiResponse {
  token?: string;
  bounty?: number;
  username?: string;
  avatar?: string;
}

export interface RegisterResponse extends ApiResponse {
  variant: string;
  msg: string;
}

export interface ValidateTokenResponse extends ApiResponse {
  status: number;
  user?: {
    username: string;
    full_name: string;
    bounty: number;
    avatar_url: string;
    email: string;
    [key: string]: any;
  };
}

// User Type
export interface User {
  username: string;
  full_name: string;
  bounty: number;
  avatar: string;
  email: string;
}

// Room Types
export interface RoomInfo {
  room_id: number;
  creator: string;
  bonus?: number;
  fee?: number;
  size?: number;
  members: number;
  status: number; // 0=Waiting, 1=Full, 2=Playing, 3=Closed
  created_at?: string;
  updated_at?: string;
}

export interface GetRoomsRequest {
  search_key?: string;
  pgSize?: number;
  pgNum?: number;
}

export interface GetRoomsResponse {
  data: RoomInfo[];
  total: Array<{ total_cnt: number }>;
}

