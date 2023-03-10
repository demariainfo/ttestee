import { AdminOrOwnerGuard } from '@demaria/common/guards/admin-or-owner.guard';
import { AdminGuard } from '@demaria/common/guards/admin.guard';
import { AuthGuard } from '@demaria/common/guards/auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { UsuariosService } from './usuarios.service';

@ApiBearerAuth()
@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({ status: 200, description: 'Usuários listados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Não autorizado, usuário não é administrador' })
  list() {
    return this.usuariosService.list();
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Não autorizado, usuário não é administrador' })
  create(@Body() criarUsuárioDto: CriarUsuarioDto) {
    return this.usuariosService.create(criarUsuárioDto);
  }

  @Get(':id(\\d+)')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Busca um usuário pelo id' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Não autorizado, usuário não é administrador' })
  read(@Param('id') id: number) {
    return this.usuariosService.read(id);
  }

  @Put(':id(\\d+)')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Atualiza um usuário pelo id' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Não autorizado, usuário não é administrador' })
  update(@Param('id') id: number, @Body() atualizarUsuarioDto: AtualizarUsuarioDto) {
    return this.usuariosService.update(id, atualizarUsuarioDto);
  }

  @Delete(':id(\\d+)')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Deleta um usuário pelo id' })
  @ApiResponse({ status: 200, description: 'Usuário deletado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Não autorizado, usuário não é administrador' })
  delete(@Param('id') id: number) {
    return this.usuariosService.delete(id);
  }

  @Get(':id(\\d+)/empresas')
  @UseGuards(AuthGuard, AdminOrOwnerGuard)
  @ApiOperation({ summary: 'Lista as empresas de um usuário' })
  @ApiResponse({ status: 200, description: 'Empresas listadas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Não autorizado, usuário não é administrador ou dono do recurso' })
  empresas(@Param('id') id: number) {
    return this.usuariosService.findEmpresasByUsuarioId(id);
  }
}
