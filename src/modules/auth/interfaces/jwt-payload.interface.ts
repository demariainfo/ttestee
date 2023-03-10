export interface IJwtPayload {
  id: number;
  ip?: string;
  tipo?: 'usuario' | 'redefinir-senha' | 'confirmar-email' | 'api';
  token?: string;
  empresaId?: number;
}
