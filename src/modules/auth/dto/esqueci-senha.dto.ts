import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EsqueciSenhaDto {
  @IsNotEmpty({ message: 'Você precisa informar um email' })
  @IsString({ message: 'Email deve ser uma string' })
  @IsEmail({}, { message: 'Email inválido' })
  @ApiProperty({
    description: 'Email do usuário',
    example: 'email@exemplo.com.br',
    type: String,
  })
  email: string;
}
