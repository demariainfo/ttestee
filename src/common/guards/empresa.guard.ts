import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Empresa, Usuario } from '@prisma/client';
import { Observable } from 'rxjs';

interface IRequestGuard extends Request {
  user: Usuario & { empresa?: Empresa };
}

@Injectable()
export class EmpresaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<IRequestGuard>();
    const usuario = request.user;

    // Se o usuário não tiver uma empresa, não pode acessar a rota
    return Boolean(usuario.empresa);
  }
}
