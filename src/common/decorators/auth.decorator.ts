import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { authguard } from 'src/module/auth/guards/auth.guard';
import { RoleGuard } from 'src/module/auth/guards/role.guard';

export function AuthDecorator() {
  return applyDecorators(
    UseGuards(authguard, RoleGuard),
    ApiBearerAuth('Authorization'),
  );
}
