// types/user.types.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  loginCount?: number;
  address?: string;
  bio?: string;
}

export type UserRole = "admin" | "user" | "moderator";
export type UserStatus = "active" | "inactive" | "banned";

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  admins: number;
}

export interface CreateUserPayload {
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

export interface CreateUserResponse {
  data: {
    id: string;
    email: string;
    temporaryPassword: string;
    fullName: string;
    role: UserRole;
    status: UserStatus;
  };
}

export interface ResetPasswordResponse {
  data: {
    newPassword: string;
  };
}
