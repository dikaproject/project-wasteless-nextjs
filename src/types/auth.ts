// types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
      id: number;
      role: 'admin' | 'seller' | 'user';
      name: string;
    };
    message?: string;
  }
  

export interface JWTPayload {
    userId: number;
    email: string;
    role: string;
    exp: number;
  }