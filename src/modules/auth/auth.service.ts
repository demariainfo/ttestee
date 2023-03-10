import { isValidPassword } from '@demaria/utils/password';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario, UsuarioTipoEnum } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { EmailService } from '../email/email.service';

import { UsuariosService } from '../usuarios/usuarios.service';
import { CadastroDto } from './dto/cadastro.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { LoginDto } from './dto/login.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { SelecionarEmpresaDto } from './dto/selecionar-empresa.dto';
import { IAccessToken } from './interfaces/access-token.interface';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly usuariosService: UsuariosService
  ) {}

  async login(loginDto: LoginDto): Promise<IAccessToken> {
    const usuario = await this.usuariosService.findOneBy({ email: loginDto.email }, { empresas: true });
    if (!(usuario && isValidPassword(usuario.senha, loginDto.senha)))
      throw new UnauthorizedException('Credenciais inválidas');

    // Criar o payload do JWT com o id do usuário e o ip de login
    const payload: IJwtPayload = {
      id: usuario.id,
      tipo: 'usuario',
    };

    /* Checking if the user is an admin. */
    if (usuario.tipo !== UsuarioTipoEnum.ADMIN) {
      const empresas = await this.usuariosService.findEmpresasByUsuarioId(usuario.id);
      if (empresas.length === 1) payload.empresaId = empresas[0].id;
    }

    // Gerar o token de acesso
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async cadastro(cadastroDto: CadastroDto) {
    // Remove a confirmação de senha do objeto
    delete cadastroDto?.confirmacaoSenha;

    // Gerar um token aleatório para confirmar o email
    const tokenConfirmacaoEmail = randomUUID();

    // Criar o usuário no banco de dados
    const usuario = await this.usuariosService.create({
      ...cadastroDto,
      tokenConfirmacaoEmail,
    });

    // Criar o payload do JWT com o id do usuário e o token de confirmação de email
    const payload: IJwtPayload = {
      id: usuario.id,
      tipo: 'usuario',
    };
    const jwtToken = this.jwtService.sign(payload, { expiresIn: '15d' });

    // Enviar o email de confirmação
    await this.emailService.enviaConfirmarEmail(usuario, jwtToken);

    return {
      message: 'Cadastro realizado com sucesso',
      usuario,
    };
  }

  async confirmarEmail(usuario: Usuario) {
    // Atualiza o usuário para confirmado e a data de confirmação
    await this.usuariosService.update(usuario.id, {
      emailConfirmadoEm: new Date(),
    });

    // Enviar email de confirmação de email
    await this.emailService.enviaEmailConfirmado(usuario);

    return {
      message: 'Email confirmado com sucesso',
    };
  }

  async esqueciSenha({ email }: EsqueciSenhaDto) {
    const usuario = await this.usuariosService.findOneBy({ email });
    if (usuario) {
      // Gera um token aleatório para redefinir a senha
      const tokenRedefinirSenha = randomUUID();

      // Atualiza o token de redefinição de senha do usuário
      await this.usuariosService.update(usuario.id, {
        tokenRecuperacaoSenha: tokenRedefinirSenha,
      });

      // Criar o payload do JWT com o id do usuário e o token de redefinição de senha
      const payload = {
        id: usuario.id,
        token: tokenRedefinirSenha,
        tipo: 'redefinir-senha',
      } as IJwtPayload;

      // Gerar o token de acesso
      const jwtToken = this.jwtService.sign(payload, { expiresIn: '15m' });

      // Enviar o email de redefinição de senha
      await this.emailService.enviaRedefinirSenha(usuario, jwtToken);
    }

    return {
      message: 'Caso exista um usuário com este email, você receberá um email com instruções para redefinir sua senha',
    };
  }

  async redefinirSenha(usuario: Usuario, redefinirSenhaDto: RedefinirSenhaDto) {
    // Atualiza a senha do usuário e limpa o token de redefinição de senha
    await this.usuariosService.update(usuario.id, {
      senha: redefinirSenhaDto.senha,
      tokenRecuperacaoSenha: null,
      ultimaAlteracaoSenha: new Date(),
    });

    // Enviar email de senha alterada
    await this.emailService.enviaSenhaAlterada(usuario);

    return {
      message: 'Senha alterada com sucesso',
    };
  }

  async selecionarEmpresa(usuario: Usuario, selecionarEmpresaDto: SelecionarEmpresaDto): Promise<IAccessToken> {
    // Verificar se a empresa existe e o usuário tem acesso a ela
    const empresa = await this.usuariosService.findEmpresaByUsuarioIdAndEmpresaId(usuario.id, selecionarEmpresaDto.id);
    if (!empresa) throw new UnauthorizedException('Empresa não encontrada');

    // Criar o payload do JWT com o id do usuário, ip e id da serventia
    const payload: IJwtPayload = {
      id: usuario.id,
      tipo: 'usuario',
      empresaId: empresa.id,
    };

    // Gerar o token de acesso
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
