import bcryptjs from 'bcryptjs';

export function isValidPassword(hash: string, senha: string): boolean {
  return bcryptjs.compareSync(senha, hash);
}

export function hashPassword(senha: string): string {
  return bcryptjs.hashSync(senha, 10);
}
