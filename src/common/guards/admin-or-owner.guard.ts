import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Empresa, Usuario } from '@prisma/client';
import { Request } from 'express';

interface IRequestGuard extends Request {
  user: Usuario & { empresa?: Empresa };
}

@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IRequestGuard>();
    const usuario = request.user;
    const { id } = request.params;

    return Boolean(usuario.id === Number(id) || usuario.tipo === 'ADMIN');
  }
}
