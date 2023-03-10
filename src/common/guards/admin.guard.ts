import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Empresa, Usuario, UsuarioTipoEnum } from '@prisma/client';
import { Request } from 'express';

interface IRequestGuard extends Request {
  user: Usuario & { empresa?: Empresa };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IRequestGuard>();
    const usuario = request.user;

    // Se o usuário não tiver uma empresa, não pode acessar a rota
    return Boolean(usuario.tipo === UsuarioTipoEnum.ADMIN);
  }
}
