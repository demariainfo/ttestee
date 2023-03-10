import { Exists } from '@demaria/common/decorators/validators/exists.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CriarUsuarioDto {
  @IsNotEmpty({ message: 'Você deve informar um nome' })
  @IsString({ message: 'O nome deve ser uma string' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    type: String,
  })
  nome: string;

  @IsNotEmpty({ message: 'Você deve informar um email' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  @Exists('usuario', 'email', { message: 'Este email já está em uso' })
  @ApiProperty({
    description: 'Email do usuário',
    example: 'email@exemplo.com.br',
    type: String,
  })
  email: string;

  @IsNotEmpty({ message: 'Você deve informar uma senha' })
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @ApiProperty({
    description: 'Senha do usuário',
    example: '12345678',
    type: String,
  })
  senha: string;
}
