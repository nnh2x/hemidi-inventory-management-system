import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  AuthUser,
  TokenValidationResponse,
} from '../common/interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') ||
      'http://localhost:3001';
  }

  /**
   * Validate JWT token with auth service
   */
  async validateToken(token: string): Promise<AuthUser> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<TokenValidationResponse>(
          `${this.authServiceUrl}/auth/validate-token`,
          { token },
          {
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (!response.data.valid || !response.data.user) {
        throw new UnauthorizedException('Invalid token');
      }

      return response.data.user;
    } catch (error) {
      this.logger.error('Token validation failed:', error.message);
      throw new UnauthorizedException('Token validation failed');
    }
  }

  /**
   * Get user information by token
   */
  async getUserInfo(token: string): Promise<AuthUser> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ user: AuthUser }>(
          `${this.authServiceUrl}/auth/me`,
          {
            timeout: 5000,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      return response.data.user;
    } catch (error) {
      this.logger.error('Get user info failed:', error.message);
      throw new UnauthorizedException('Failed to get user information');
    }
  }

  /**
   * Check if auth service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/health`, {
          timeout: 3000,
        }),
      );
      return response.status === 200;
    } catch (error) {
      this.logger.warn('Auth service health check failed:', error.message);
      return false;
    }
  }
}
