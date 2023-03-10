import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '../email/email.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategies/auth.strategy';
import { ConfirmarEmailStrategy } from './strategies/confirmar-email.strategy';
import { RedefinirSenhaStrategy } from './strategies/redefinir-senha.strategy';

@Module({
  imports: [
    EmailModule,
    UsuariosModule,
    PassportModule.register({ property: 'user' }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy, ConfirmarEmailStrategy, RedefinirSenhaStrategy],
  exports: [AuthStrategy, ConfirmarEmailStrategy, RedefinirSenhaStrategy, PassportModule],
})
export class AuthModule {}
