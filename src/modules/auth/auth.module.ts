import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../guard/auth.guard';
import { AdminGuard } from '../guard/admin.guard';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AuthService, AuthGuard, AdminGuard],
  exports: [AuthService, AuthGuard, AdminGuard],
})
export class AuthModule {}
