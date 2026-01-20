export interface LoginResponse {
  result: {
    token: string;
    refresh_token: string;
  };
  code: number;
  message: string;
}

export interface JWTToken {
  token: string;
  expired_at: string;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string | null;
  updated_at: string | null;
  provider: string | null;
  provider_id: string | null;
  avatar: string | null;
}
