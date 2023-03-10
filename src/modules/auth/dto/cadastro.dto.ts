import { Match } from '@demaria/common/decorators/validators/match.decorator';
import { CriarUsuarioDto } from '@demaria/modules/usuarios/dto/criar-usuario.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CadastroDto extends CriarUsuarioDto {
  @IsNotEmpty({ message: 'Você deve informar a confirmação da senha' })
  @Match('senha', { message: 'A confirmação da senha deve ser igual a senha' })
  @ApiProperty({
    description: 'Confirmação da senha do usuário',
    example: '12345678',
    type: String,
  })
  confirmacaoSenha: string;
}
