import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { tokenUtils } from '../utils/token';
import type { User, LoginRequest, RegisterRequest } from '../types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string; variant: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message: string; variant: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = tokenUtils.getUser();
      const token = tokenUtils.getToken();

      if (token && storedUser) {
        try {
          const isValid = await apiService.checkAuth();
          if (isValid) {
            const updatedUser = tokenUtils.getUser();
            setUser(updatedUser);
            setIsAuthenticated(true);
          } else {
            tokenUtils.clearAll();
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          tokenUtils.clearAll();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.variant === 'success' && response.token) {
        const userData = tokenUtils.getUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
        return {
          success: true,
          message: response.msg || 'Login successful',
          variant: response.variant || 'success',
        };
      } else {
        return {
          success: false,
          message: response.msg || 'Login failed',
          variant: response.variant || 'error',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
        variant: 'error',
      };
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await apiService.register(userData);
      
      return {
        success: response.variant === 'success',
        message: response.msg || (response.variant === 'success' ? 'Registration successful' : 'Registration failed'),
        variant: response.variant || 'error',
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'An error occurred during registration',
        variant: 'error',
      };
    }
  };

  const logout = async () => {
    try {
      if (user?.username) {
        await apiService.logout(user.username);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenUtils.clearAll();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const isValid = await apiService.checkAuth();
      if (isValid) {
        const userData = tokenUtils.getUser();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

