import type { Role } from "./users";

export interface ProfileRequest {
  username: string;
  email: string;
  phoneNumber: string;
}

export interface UserRegistration extends ProfileRequest {
  login: string;
  password: string;
}

export interface Profile extends ProfileRequest {
  id: number;
  date: string;
  isBlocked: boolean;
  roles: Role[];
}

export interface AuthData {
  login: string;
  password: string;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface PasswordRequest {
  password: string;
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}