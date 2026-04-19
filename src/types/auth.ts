import type { Roles } from "./users";

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
  roles: Roles[];
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

export interface Token {
  accessToken: string
  refreshToken: string
}