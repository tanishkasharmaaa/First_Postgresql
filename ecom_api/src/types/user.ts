export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_blacklisted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserProfile extends Omit<User, "password"> {
  order_count?: number;
  total_spent?: number;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
  user: UserProfile;
}
