import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SelecionarEmpresaDto {
  @IsNotEmpty({ message: "O campo 'id' é obrigatório" })
  @IsNumber({}, { message: "O campo 'id' deve ser um número" })
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    description: 'Id da empresa',
    example: 1,
    type: Number,
  })
  id: number;
}
