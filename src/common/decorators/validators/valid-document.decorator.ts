import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidDocumentConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'validDocument' })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return this.validateDocument(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${this.documentType(args.value)} is invalid`;
  }

  private documentType(document: string) {
    if (document.length === 11) return 'CPF';
    else if (document.length === 14) return 'CNPJ';
    else return 'Document';
  }

  private validateDocument(value: string) {
    const document = String(value).replace(/\D/g, '');
    if (document.length === 11) return this.validateCPF(document);
    else if (document.length === 14) return this.validateCNPJ(document);
    else return false;
  }

  private validateCPF(document: string) {
    if (document.length !== 11 || document.match(/(\d)\1{10}/)) return false;

    const cpf: number[] = document.split('').map(el => +el);
    const rest = (count: any): number =>
      ((cpf.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10;

    return rest(10) === cpf[9] && rest(11) === cpf[10];
  }

  private validateCNPJ(document: string) {
    if (document.length !== 14 || document.match(/(\d)\1{13}/)) return false;

    const cnpj: number[] = document.split('').map(el => +el);
    const rest = (count: any, digitCount: any): number =>
      ((cnpj.slice(0, count - digitCount).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10;

    return rest(12, 2) === cnpj[12] && rest(13, 1) === cnpj[13];
  }
}
