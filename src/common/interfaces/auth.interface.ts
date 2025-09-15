// Environment configuration interface
export interface AuthConfig {
  authServiceUrl: string;
  jwtSecret?: string;
}

// User interface from auth service
export interface AuthUser {
  id: number;
  userName: string;
  userCode: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Token validation response from auth service
export interface TokenValidationResponse {
  valid: boolean;
  user?: AuthUser;
  message?: string;
}

// Auth service endpoints
export interface AuthEndpoints {
  validateToken: string;
  getUserInfo: string;
}
