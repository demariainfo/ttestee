import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);

  constructor(@InjectQueue('FilaEmail') private emailQueue: Queue) {}

  enviaBoasVindas(usuario: Usuario, senha: string) {
    this.logger.debug(`Adding job to queue: boas-vindas - ${usuario.email}`);
    return this.emailQueue.add('boas-vindas', { usuario, senha });
  }

  enviaConfirmarEmail(usuario: Usuario, token: string) {
    this.logger.debug(`Adding job to queue: confirmar-email - ${usuario.email}`);
    return this.emailQueue.add('confirmar-email', { usuario, token });
  }

  enviaEmailConfirmado(usuario: Usuario) {
    this.logger.debug(`Adding job to queue: email-confirmado - ${usuario.email}`);
    return this.emailQueue.add('email-confirmado', { usuario });
  }

  enviaRedefinirSenha(usuario: Usuario, token: string) {
    this.logger.debug(`Adding job to queue: redefinir-senha - ${usuario.email}`);
    return this.emailQueue.add('redefinir-senha', { usuario, token });
  }

  enviaSenhaAlterada(usuario: Usuario) {
    this.logger.debug(`Adding job to queue: senha-alterada - ${usuario.email}`);
    return this.emailQueue.add('senha-alterada', { usuario });
  }
}
