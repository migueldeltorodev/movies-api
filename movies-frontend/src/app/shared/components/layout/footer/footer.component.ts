import { Component } from '@angular/core';
import { CORE_IMPORTS } from '../../../material.imports';
import { APP_CONFIG } from '../../../constants';

/**
 * Componente de pie de página
 * Información de la aplicación y enlaces útiles
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    ...CORE_IMPORTS
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly appConfig = APP_CONFIG;
  readonly currentYear = new Date().getFullYear();

  /**
   * Enlaces del footer con sus respectivas URLs
   */
  readonly footerLinks = [
    { label: 'Acerca de', url: '/about', external: false },
    { label: 'Contacto', url: '/contact', external: false },
    { label: 'GitHub', url: 'https://github.com/migueldeltorodev', external: true }
  ];

  /**
   * Maneja el clic en enlaces externos
   */
  handleExternalLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}