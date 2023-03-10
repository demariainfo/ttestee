import { CrudContract } from '@demaria/common/contracts/crud.contract';
import { hashPassword } from '@demaria/utils/password';
import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Prisma, Usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService implements CrudContract<Usuario> {
  constructor(private readonly prismaService: PrismaService) {}

  list() {
    return this.prismaService.usuario.findMany();
  }

  create(createUserDto: Prisma.UsuarioCreateInput) {
    // Caso a senha tenha sido informada, criptografar
    if (createUserDto.senha) createUserDto.senha = hashPassword(createUserDto.senha);

    return this.prismaService.usuario.create({ data: createUserDto });
  }

  async read(id: number, include?: Prisma.UsuarioInclude) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id },
      include,
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  update(id: number, updateUserDto: Prisma.UsuarioUpdateInput) {
    return this.prismaService.usuario.update({
      where: { id },
      data: updateUserDto,
    });
  }

  delete(id: number) {
    return this.prismaService.usuario.delete({ where: { id } });
  }

  deleteBy(where: Prisma.UsuarioWhereUniqueInput) {
    return this.prismaService.usuario.delete({ where });
  }

  count() {
    return this.prismaService.usuario.count();
  }

  countBy(where: Prisma.UsuarioWhereInput) {
    return this.prismaService.usuario.count({ where });
  }

  findBy(where: Prisma.UsuarioWhereInput, include?: Prisma.UsuarioInclude) {
    return this.prismaService.usuario.findMany({ where, include });
  }

  findOneBy(where: Prisma.UsuarioWhereUniqueInput, include?: Prisma.UsuarioInclude) {
    return this.prismaService.usuario.findUnique({ where, include });
  }

  async findEmpresasByUsuarioId(usuarioId: number) {
    const usuarioEmpresas = await this.prismaService.usuarioEmpresa.findMany({
      where: { usuarioId },
      include: { empresa: true },
    });
    return usuarioEmpresas.map(usuarioEmpresa => usuarioEmpresa.empresa);
  }

  async findEmpresaByUsuarioIdAndEmpresaId(usuarioId: number, empresaId: number) {
    const usuarioEmpresa = await this.prismaService.usuarioEmpresa.findUnique({
      where: { empresaId_usuarioId: { empresaId, usuarioId } },
      include: { empresa: true },
    });
    return usuarioEmpresa?.empresa;
  }
}
