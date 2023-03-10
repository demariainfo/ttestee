import { Match } from '@demaria/common/decorators/validators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RedefinirSenhaDto {
  @IsNotEmpty({ message: 'Você precisa informar uma senha' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @ApiProperty({
    description: 'Senha do usuário',
    example: '12345678',
    type: String,
  })
  senha: string;

  @IsNotEmpty({ message: 'Você precisa confirmar sua senha' })
  @Match('senha', { message: 'As senhas não conferem' })
  @ApiProperty({
    description: 'Confirmação da senha do usuário',
    example: '12345678',
    type: String,
  })
  confirmarSenha: string;
}
