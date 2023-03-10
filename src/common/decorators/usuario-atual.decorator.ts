import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Empresa, Usuario } from '@prisma/client';
import { Request } from 'express';

interface IRequestUser extends Request {
  user: Usuario & { empresa?: Empresa };
}

export const UsuarioAtual = createParamDecorator((param: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<IRequestUser>();
  const usuario = request.user;

  return param ? usuario && usuario[param] : usuario;
});
