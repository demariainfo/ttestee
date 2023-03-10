import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
export const ConfirmarEmailGuard = NestAuthGuard('confirmar-email');
