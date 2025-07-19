import { Component, inject } from '@angular/core';
import { CORE_IMPORTS, MATERIAL_IMPORTS } from '../../../material.imports';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { APP_CONFIG } from '../../../constants';

/**
 * Componente de navegación principal
 * Maneja la barra de navegación superior con autenticación
 * 
 * Patrón: Direct Injection - El componente maneja su propia lógica
 * Ventajas:
 * - Componente autosuficiente
 * - Menos acoplamiento con el padre
 * - Código más limpio y directo
 * - Fácil de testear de forma aislada
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ...CORE_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  readonly appConfig = APP_CONFIG;

  /**
   * Maneja el login directamente
   * Patrón: Responsabilidad única - el componente maneja su propia lógica
   */
  handleLogin() {
    this.authService.quickLogin().subscribe({
      next: () => {
        this.notification.messages.loginSuccess();
      },
      error: (error) => {
        console.error('Error during quick login:', error);
        this.notification.messages.loginError();
      }
    });
  }

  /**
   * Maneja el logout directamente
   * Patrón: Responsabilidad única - el componente maneja su propia lógica
   */
  handleLogout() {
    this.authService.logout();
    this.notification.messages.logoutSuccess();
  }
}