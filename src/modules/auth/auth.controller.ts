import { UsuarioAtual } from '@demaria/common/decorators/usuario-atual.decorator';
import { AuthGuard } from '@demaria/common/guards/auth.guard';
import { ConfirmarEmailGuard } from '@demaria/common/guards/confirmar-email.guard';
import { RedefinirSenhaGuard } from '@demaria/common/guards/redefinir-senha.guard';
import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Empresa, Usuario } from '@prisma/client';
import { AuthService } from './auth.service';
import { CadastroDto } from './dto/cadastro.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { LoginDto } from './dto/login.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { SelecionarEmpresaDto } from './dto/selecionar-empresa.dto';

@ApiTags('Autenticação e autorização')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  autenticado(@UsuarioAtual() usuario: Usuario & { empresa?: Empresa }) {
    return usuario;
  }

  @Post('login')
  @ApiOperation({ summary: 'Realiza o login do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('cadastro')
  @ApiOperation({ summary: 'Realiza o cadastro do usuário' })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  cadastro(@Body() cadastroDto: CadastroDto) {
    return this.authService.cadastro(cadastroDto);
  }

  @Get('confirmar-email')
  @UseGuards(ConfirmarEmailGuard)
  @ApiOperation({ summary: 'Confirma o email do usuário' })
  @ApiResponse({ status: 200, description: 'Email confirmado' })
  @ApiResponse({ status: 401, description: 'Não autorizado, token inválido' })
  confirmarEmail(@UsuarioAtual() usuario: Usuario) {
    return this.authService.confirmarEmail(usuario);
  }

  @Post('esqueci-senha')
  @ApiOperation({ summary: 'Envia um email para o usuário com um link para redefinir a senha' })
  @ApiResponse({ status: 200, description: 'Email enviado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  esqueciSenha(@Body() esqueciSenhaDto: EsqueciSenhaDto) {
    return this.authService.esqueciSenha(esqueciSenhaDto);
  }

  @Patch('redefinir-senha')
  @UseGuards(RedefinirSenhaGuard)
  @ApiOperation({ summary: 'Redefine a senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha redefinida' })
  @ApiResponse({ status: 401, description: 'Não autorizado, token inválido' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  redefinirSenha(@UsuarioAtual() usuario: Usuario, @Body() redefinirSenhaDto: RedefinirSenhaDto) {
    return this.authService.redefinirSenha(usuario, redefinirSenhaDto);
  }

  @Post('empresa')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seleciona a empresa do usuário' })
  @ApiResponse({ status: 200, description: 'Empresa selecionada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  selecionarServentia(@UsuarioAtual() usuario: Usuario, @Body() selecionarEmpresaDto: SelecionarEmpresaDto) {
    return this.authService.selecionarEmpresa(usuario, selecionarEmpresaDto);
  }
}
