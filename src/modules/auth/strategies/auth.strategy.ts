import { UsuariosService } from '@demaria/modules/usuarios/usuarios.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Empresa } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'auth') {
  private logger = new Logger(AuthStrategy.name);

  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: IJwtPayload) {
    const { id, tipo, empresaId } = payload;
    if (tipo !== 'usuario') throw new UnauthorizedException('Tipo de token inválido');

    const usuario = await this.usuariosService.read(id);
    if (!usuario) throw new UnauthorizedException('Usuário não encontrado');

    let empresa: Empresa;
    if (empresaId) {
      empresa = await this.usuariosService.findEmpresaByUsuarioIdAndEmpresaId(usuario.id, empresaId);
      if (!empresa) throw new UnauthorizedException('Usuário não possui acesso a esta empresa');
    }

    this.logger.debug(
      `Usuário autenticado: [${usuario.id}] ${usuario.nome}${empresa ? ` (Empresa: ${empresa.nome})` : ''}`
    );

    return { ...usuario, empresa };
  }
}
