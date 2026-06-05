import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Leer los roles permitidos desde la configuración (data) del enrutador
  const rolesPermitidos = route.data['roles'] as Array<string>;

  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  if (authService.tieneRol(rolesPermitidos)) {
    return true;
  }

  // Si no tiene permiso, lo mandamos al login
  router.navigate(['/login']);
  return false;
};
