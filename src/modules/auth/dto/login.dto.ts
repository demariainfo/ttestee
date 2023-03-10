import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Você precisa informar um email' })
  @IsString({ message: 'Email deve ser uma string' })
  @IsEmail({}, { message: 'Email inválido' })
  @ApiProperty({
    description: 'Email do usuário',
    example: 'email@exemplo.com.br',
    type: String,
  })
  email: string;

  @IsNotEmpty({ message: 'Você precisa informar uma senha' })
  @IsString({ message: 'Senha deve ser uma string' })
  @ApiProperty({
    description: 'Senha do usuário',
    example: '12345678',
    type: String,
  })
  senha: string;
}
