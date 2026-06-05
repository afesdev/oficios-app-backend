import {
  Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseStorageService } from '../firebase/firebase-storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';

@ApiTags('Archivos')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly storage: FirebaseStorageService) {}

  @Post(':folder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir archivo a Firebase Storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|mp4|mov|pdf)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('folder') folder: string,
    @CurrentUser() user: Usuario,
  ) {
    const result = await this.storage.uploadFile(file, folder, user.id.toString());
    return result;
  }
}
