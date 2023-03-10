import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { Job } from 'bull';

@Processor('FilaEmail')
export class EmailProcessor {
  private logger = new Logger(EmailProcessor.name);
  private defaultContext = {
    app_name: process.env.APP_NAME,
    app_url: process.env.FRONTEND_DOMAIN,
  };

  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name} with data `, job.data);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.log(`Completed job ${job.id} of type ${job.name} with result`, result);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }

  @Process('boas-vindas')
  async enviaBoasVindas(job: Job<{ usuario: Usuario; senha: string }>) {
    const { usuario, senha } = job.data;
    console.log('enviaBoasVindas', usuario, senha);

    await this.mailerService.sendMail({
      to: usuario.email,
      subject: 'Bem vindo(a)',
      template: './usuario/boas-vindas',
      context: {
        ...this.defaultContext,
        usuario: { ...usuario, senha },
        url: process.env.FRONTEND_DOMAIN.concat(`/auth/login`),
      },
    });
  }

  @Process('confirmar-email')
  async enviaConfirmarEmail(job: Job<{ usuario: Usuario; token: string }>) {
    const { usuario, token } = job.data;

    await this.mailerService.sendMail({
      to: usuario.email,
      subject: 'Confirmar Email',
      template: './auth/confirmar-email',
      context: {
        ...this.defaultContext,
        usuario,
        token,
        url: process.env.FRONTEND_DOMAIN.concat(`/auth/confirmar-email?token=${token}`),
      },
    });
  }

  @Process('email-confirmado')
  async enviaEmailConfirmado(job: Job<{ usuario: Usuario }>) {
    const { usuario } = job.data;

    await this.mailerService.sendMail({
      to: usuario.email,
      subject: 'Email Confirmado',
      template: './usuario/email-confirmado',
      context: {
        ...this.defaultContext,
        usuario,
      },
    });
  }

  @Process('redefinir-senha')
  async enviaRedefinirSenha(job: Job<{ usuario: Usuario; token: string }>) {
    const { usuario, token } = job.data;

    await this.mailerService.sendMail({
      to: usuario.email,
      subject: 'Redefinir Senha',
      template: './auth/redefinir-senha',
      context: {
        ...this.defaultContext,
        usuario,
        token,
        url: process.env.FRONTEND_DOMAIN.concat(`/auth/redefinir-senha?token=${token}`),
      },
    });

    return;
  }

  @Process('senha-alterada')
  async enviaSenhaAlterada(job: Job<{ usuario: Usuario }>) {
    const { usuario } = job.data;

    await this.mailerService.sendMail({
      to: usuario.email,
      subject: 'Senha Alterada',
      template: './usuario/senha-alterada',
      context: {
        ...this.defaultContext,
        usuario,
        url: process.env.FRONTEND_DOMAIN.concat(`/auth/login`),
      },
    });
  }
}
