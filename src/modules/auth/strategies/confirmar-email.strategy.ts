import { UsuariosService } from '@demaria/modules/usuarios/usuarios.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class ConfirmarEmailStrategy extends PassportStrategy(Strategy, 'redefinir-senha') {
  private logger = new Logger(ConfirmarEmailStrategy.name);

  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: IJwtPayload) {
    const { id, token, tipo } = payload;
    if (tipo !== 'confirmar-email') throw new UnauthorizedException('Tipo de token inválido');

    const usuario = await this.usuariosService.read(id);
    if (!usuario || usuario.tokenConfirmacaoEmail !== token)
      throw new UnauthorizedException('Usuário ou token de confirmação inválido');

    this.logger.debug(`Usuário autenticado: [${usuario.id}] ${usuario.nome}`);
    return usuario;
  }
}
