import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ROUTES } from '../../constants';

/**
 * Guard de autenticación para proteger rutas
 * Redirige a la página de auth si el usuario no está autenticado
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    router.navigate([ROUTES.auth]);
    return false;
};

/**
 * Guard para usuarios administradores
 */
export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated() && authService.isAdmin()) {
        return true;
    }

    router.navigate([ROUTES.movies]);
    return false;
};

/**
 * Guard para miembros de confianza
 */
export const trustedMemberGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated() && authService.isTrustedMember()) {
        return true;
    }

    router.navigate([ROUTES.auth]);
    return false;
};