export interface LoginResponse {
  result: {
    token: string;
    refreshToken: string;
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

export interface UserProfile extends User {
  address: string | null;
  avatar: string | null;
  bio: string | null;

  createdAt: string;
  updatedAt: string;

  dateOfBirth: string | null;

  email: string;
  emailVerified: boolean;

  fullname: string;

  mustChangePassword: boolean;

  phone: string | null;
  phoneVerified: boolean;

  provider: "LOCAL" | string;

  role: "ADMIN" | "USER" | string;

  sellerStatus: string | null;

  userId: string;
}
