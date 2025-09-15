import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './modules/guard/auth.guard';
import { AdminGuard } from './modules/guard/admin.guard';
import { CurrentUser } from './common/decorators/current-user.decorator';
import { AuthUser } from './common/interfaces/auth.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  getProtectedResource(@CurrentUser() user: AuthUser): any {
    return {
      message: 'This is a protected resource',
      user: {
        id: user.id,
        userName: user.userName,
        userCode: user.userCode,
        isAdmin: user.isAdmin,
      },
    };
  }

  @Get('admin')
  @UseGuards(AuthGuard, AdminGuard)
  getAdminResource(@CurrentUser() user: AuthUser): any {
    return {
      message: 'This is an admin-only resource',
      user: {
        id: user.id,
        userName: user.userName,
        userCode: user.userCode,
        isAdmin: user.isAdmin,
      },
    };
  }

  @Get('inventory')
  @UseGuards(AuthGuard)
  getInventory(@CurrentUser() user: AuthUser): any {
    return {
      message: 'Inventory management system',
      inventory: [
        { id: 1, name: 'Product A', quantity: 100 },
        { id: 2, name: 'Product B', quantity: 50 },
        { id: 3, name: 'Product C', quantity: 200 },
      ],
      accessedBy: {
        userName: user.userName,
        userCode: user.userCode,
      },
    };
  }

  @Get('health')
  async checkHealth(): Promise<any> {
    return {
      status: 'ok',
      service: 'Inventory Management System',
      timestamp: new Date().toISOString(),
    };
  }
}
