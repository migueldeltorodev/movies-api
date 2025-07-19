import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Imports optimizados
import { CORE_IMPORTS } from './shared/material.imports';

// Componentes de layout
import { NavbarComponent } from './shared/components/layout/navbar/navbar.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';

/**
 * Componente raíz de la aplicación
 * 
 * Patrón: Pure Layout Component
 * Responsabilidad única: Definir la estructura de layout de la aplicación
 * 
 * Ventajas de este enfoque:
 * - Componente completamente limpio y enfocado
 * - Sin lógica de negocio - solo estructura
 * - Fácil de mantener y testear
 * - Cada componente maneja su propia responsabilidad
 */
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ...CORE_IMPORTS,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}