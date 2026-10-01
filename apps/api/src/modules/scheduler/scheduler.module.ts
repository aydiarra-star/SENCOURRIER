import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AnalyticsModule } from '../analytics/analytics.module';
import { EditorialScheduler } from './editorial.scheduler';

@Module({
  imports: [ScheduleModule.forRoot(), AnalyticsModule],
  providers: [EditorialScheduler],
})
export class SchedulerModule {}
