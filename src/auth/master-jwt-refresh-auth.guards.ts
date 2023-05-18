import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MasterJwtRefreshAuthGuard extends AuthGuard(
  'master-jwt-refresh',
) {}
