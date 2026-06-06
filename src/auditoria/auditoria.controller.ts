import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { SearchAuditDto } from './dto/search-audit.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Auditoría')
@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consultar auditoría (requiere rol admin)' })
  search(@Query() query: SearchAuditDto) {
    return this.audit.search(query);
  }
}
