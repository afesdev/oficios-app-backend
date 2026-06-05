import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from '../usuarios/usuario.entity';

export const CurrentUser = createParamDecorator(
  (data: keyof Usuario | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as Usuario;
    return data ? user?.[data] : user;
  },
);
