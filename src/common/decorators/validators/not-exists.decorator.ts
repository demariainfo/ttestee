import { PrismaService } from '@demaria/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function NotExists(entity: string, column: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, column],
      validator: NotExistsConstraint,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'notExists', async: true })
export class NotExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(value: string | number, args: ValidationArguments) {
    const [entity, column] = args.constraints;

    // Condição de busca
    const where = { [column]: { equals: value } };

    // Verifica se o id do objeto existe, se existir, adiciona a condição de não ser o id do objeto
    const { id } = args.object as any;
    if (id) Object.assign(where, { id: { not: id } });

    // Instancia o prisma client
    const prismaClient = new PrismaClient();

    try {
      const result: number = await prismaClient[entity].count({ where });
      return Boolean(result);
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      // Fecha a conexão com o banco de dados
      await prismaClient.$disconnect();
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [entity, column] = args.constraints;
    return `${column} with value ${args.value} already exists in ${entity}`;
  }
}
