import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
export const RedefinirSenhaGuard = NestAuthGuard('redefinir-senha');
