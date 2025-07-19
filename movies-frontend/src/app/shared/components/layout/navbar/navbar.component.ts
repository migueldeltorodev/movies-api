import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CORE_IMPORTS, MATERIAL_IMPORTS } from '../../../material.imports';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { MessagesService } from '../../../';
import { APP_CONFIG, ROUTES } from '../../../constants';
import { LanguageSelectorComponent } from '../../../components/language-selector/language-selector.component';

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
    ...MATERIAL_IMPORTS,
    LanguageSelectorComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly messagesService = inject(MessagesService);
  readonly appConfig = APP_CONFIG;

  // Mensajes reactivos disponibles en el template
  readonly messages = this.messagesService.nav;

  /**
   * Navega a la página de autenticación
   * Production-ready: Redirige a página de login/registro real
   */
  handleLogin() {
    this.router.navigate([ROUTES.auth]);
  }

  /**
   * Maneja el logout directamente
   * Patrón: Responsabilidad única - el componente maneja su propia lógica
   */
  handleLogout() {
    this.authService.logout();
    this.notification.success(this.messagesService.auth().logoutSuccess);
  }
}