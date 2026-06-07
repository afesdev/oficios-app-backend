import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PromocionesService } from '../promociones/promociones.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly promociones: PromocionesService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async expirarPromociones() {
    this.logger.log('⏰ Ejecutando tarea: expirar promociones vencidas...');
    try {
      const afectadas = await this.promociones.expirarVencidas();
      if (afectadas > 0) {
        this.logger.log(`✅ ${afectadas} promociones expiradas automáticamente`);
      }
    } catch (err) {
      this.logger.error('Error al expirar promociones vencidas', err);
    }
  }
}
