import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PromocionesModule } from '../promociones/promociones.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [ScheduleModule.forRoot(), PromocionesModule],
  providers: [TasksService],
})
export class TasksModule {}
