export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'admin' | 'seller' | 'user';
    created_at: string;
    updated_at: string;
  }