import { Controller, Post, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DailyStockCheckJob } from '../../../jobs/daily-stock-check.job';

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly dailyStockCheckJob: DailyStockCheckJob) {}

  @Post('daily-stock-check')
  @ApiOperation({ summary: 'Manually trigger daily stock check job' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Daily stock check job triggered successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Daily stock check completed successfully',
        },
        executionTime: { type: 'string', example: '2024-01-15T10:30:00Z' },
        result: {
          type: 'object',
          properties: {
            totalItems: { type: 'number', example: 48 },
            lowStockItems: { type: 'number', example: 5 },
            alertsGenerated: { type: 'number', example: 3 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Job execution failed',
  })
  async triggerDailyStockCheck() {
    try {
      const startTime = new Date();
      const result = await this.dailyStockCheckJob.handleDailyStockCheck();

      return {
        message: 'Daily stock check completed successfully',
        executionTime: startTime.toISOString(),
        result,
      };
    } catch (error) {
      throw new Error(`Job execution failed: ${error.message}`);
    }
  }

  @Post('stock-check')
  @ApiOperation({ summary: 'Manually trigger stock check' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stock check completed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Stock check completed successfully',
        },
        executionTime: { type: 'string', example: '2024-01-15T10:30:00Z' },
        result: {
          type: 'object',
          properties: {
            itemsChecked: { type: 'number', example: 48 },
            alertsGenerated: { type: 'number', example: 3 },
          },
        },
      },
    },
  })
  async triggerStockCheck() {
    try {
      const startTime = new Date();
      // Call the daily stock check which includes all functionality
      const result = await this.dailyStockCheckJob.handleDailyStockCheck();

      return {
        message: 'Stock check completed successfully',
        executionTime: startTime.toISOString(),
        result,
      };
    } catch (error) {
      throw new Error(`Job execution failed: ${error.message}`);
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Get job scheduling status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Job status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        jobs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Daily Stock Check' },
              schedule: { type: 'string', example: '0 6 * * *' },
              nextRun: { type: 'string', example: '2024-01-16T06:00:00Z' },
              lastRun: { type: 'string', example: '2024-01-15T06:00:00Z' },
              status: { type: 'string', example: 'active' },
            },
          },
        },
      },
    },
  })
  async getJobStatus() {
    const currentTime = new Date();
    const nextDay = new Date(currentTime);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(6, 0, 0, 0);

    const nextHour = new Date(currentTime);
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

    const nextWeek = new Date(currentTime);
    nextWeek.setDate(nextWeek.getDate() + (7 - nextWeek.getDay()));
    nextWeek.setHours(7, 0, 0, 0);

    return {
      jobs: [
        {
          name: 'Daily Stock Check',
          schedule: '0 6 * * *',
          nextRun: nextDay.toISOString(),
          lastRun: new Date(
            currentTime.getTime() - 24 * 60 * 60 * 1000,
          ).toISOString(),
          status: 'active',
        },
        {
          name: 'Hourly Alerts',
          schedule: '0 * * * *',
          nextRun: nextHour.toISOString(),
          lastRun: new Date(
            currentTime.getTime() - 60 * 60 * 1000,
          ).toISOString(),
          status: 'active',
        },
        {
          name: 'Weekly Reconciliation',
          schedule: '0 7 * * 0',
          nextRun: nextWeek.toISOString(),
          lastRun: new Date(
            currentTime.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          status: 'active',
        },
      ],
    };
  }
}
