import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { insertSampleData } from './sample-data';
import { DataSource } from 'typeorm';

async function runQuickSeed() {
  console.log('🌱 Starting quick seed with Vietnamese sample data...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await insertSampleData(dataSource);
    console.log('🎉 Quick seeding completed successfully!');
  } catch (error) {
    console.error('❌ Quick seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runQuickSeed();
