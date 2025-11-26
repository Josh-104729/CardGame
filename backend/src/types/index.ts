// Request/Response Types
export interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface RegisterRequest {
  FirstName: string;
  LastName: string;
  UserName: string;
  Password: string;
  BirthDay: string;
  Gender: string;
  AllowedByAdmin: number;
  Email: string;
  AvatarUrl: string;
}

export interface CreateRoomRequest {
  creator: string;
  bonus: number;
  fee: number;
  size: number;
  status: number;
}

export interface GetRoomsRequest {
  search_key?: string;
  pgSize?: number;
  pgNum?: number;
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

export interface CreateRoomResponse extends ApiResponse {
  roomID: number;
}

export interface GetRoomsResponse {
  data: any[];
  total: Array<{ total_cnt: number }>;
}

// Socket Types
export interface SocketJoinParams {
  room: {
    roomId: number;
    bonus: number;
    fee: number;
    size: number;
  };
  user: {
    username: string;
    avatarUrl: string;
    bounty: number;
  };
}

export interface SocketExitParams {
  roomId: number;
}

export interface SocketStartGameParams {
  roomId: number;
}

export interface SocketShutCardsParams {
  choosedCard: any[];
  roomId: number;
  double: number;
  effectkind: string;
  effectOpen: boolean;
}

export interface SocketPassCardsParams {
  roomId: number;
}

// Room Data Types
export interface RoomUser {
  username: string;
  bounty: number;
  exitreq: boolean;
  src: string;
}

import { Card } from "./card";

export interface RoomData {
  userArray: RoomUser[];
  havingCards: Card[][];
  droppingCards: Card[][];
  restingCards: Card[];
  order: number;
  cycleCnt: number;
  isStart: boolean;
  restCardCnt: number;
  prevOrder: number;
  counterIndex: NodeJS.Timeout | null;
  counterCnt: number;
  double: number;
  isFinish: boolean;
  effectKind: string;
  effectOpen: boolean;
  host?: string;
  fee?: number;
  bonus?: number;
  size?: number;
}

