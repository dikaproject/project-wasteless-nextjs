import { JWTPayload } from '@/types/auth';

export const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as JWTPayload;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };