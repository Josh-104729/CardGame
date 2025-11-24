import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateTokenResponse,
  GetRoomsRequest,
  GetRoomsResponse,
} from '../types/api';
import { tokenUtils } from '../utils/token';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = tokenUtils.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      tokenUtils.setToken(response.token);
      if (response.username) {
        tokenUtils.setUser({
          username: response.username,
          bounty: response.bounty || 0,
          avatar: response.avatar || '',
        });
      }
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(username: string): Promise<void> {
    try {
      await this.request(API_ENDPOINTS.CLEAR_TOKEN, {
        method: 'POST',
        body: JSON.stringify({ UserName: username }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenUtils.clearAll();
    }
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    return this.request<ValidateTokenResponse>(API_ENDPOINTS.VALIDATE_TOKEN, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async checkAuth(): Promise<boolean> {
    const token = tokenUtils.getToken();
    if (!token) {
      return false;
    }

    try {
      const response = await this.validateToken(token);
      if (response.status === 1 && response.user) {
        tokenUtils.setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      tokenUtils.clearAll();
      return false;
    }
  }

  async getRooms(params: GetRoomsRequest = {}): Promise<GetRoomsResponse> {
    return this.request<GetRoomsResponse>(API_ENDPOINTS.GET_ROOMS, {
      method: 'POST',
      body: JSON.stringify({
        search_key: params.search_key || '',
        pgSize: params.pgSize || 10,
        pgNum: params.pgNum || 1,
      }),
    });
  }
}

export const apiService = new ApiService();

