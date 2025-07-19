import { Component, inject } from '@angular/core';
import { CORE_IMPORTS, MATERIAL_IMPORTS } from '../../material.imports';
import { LanguageService } from '../../services/language.service';

/**
 * Componente selector de idiomas
 * Permite cambiar entre los idiomas soportados de la aplicación
 */
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    ...CORE_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  template: `
    <button mat-icon-button 
            [matMenuTriggerFor]="languageMenu"
            class="language-button"
            [matTooltip]="tooltipText">
      <span class="language-flag">{{ languageService.currentLanguage().flag }}</span>
      <span class="language-code">{{ languageService.currentLanguage().code.toUpperCase() }}</span>
    </button>

    <mat-menu #languageMenu="matMenu" class="language-menu">
      @for (language of languageService.supportedLanguages; track language.code) {
        <button mat-menu-item 
                (click)="changeLanguage(language.code)"
                class="language-option"
                [class.active]="language.code === languageService.currentLanguage().code">
          <span class="language-flag">{{ language.flag }}</span>
          <span class="language-name">{{ language.nativeName }}</span>
          @if (language.code === languageService.currentLanguage().code) {
            <mat-icon class="check-icon">check</mat-icon>
          }
        </button>
      }
    </mat-menu>
  `,
  styles: [`
    .language-button {
      color: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      min-width: 60px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
    }

    .language-flag {
      font-size: 1.1rem;
      line-height: 1;
    }

    .language-code {
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .language-menu {
      ::ng-deep .mat-mdc-menu-panel {
        min-width: 160px;
      }
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      position: relative;

      .language-flag {
        font-size: 1.1rem;
      }

      .language-name {
        font-size: 0.9rem;
        font-weight: 500;
        flex: 1;
      }

      .check-icon {
        font-size: 1rem;
        color: #4caf50;
        margin-left: auto;
      }

      &.active {
        background: rgba(63, 81, 181, 0.08);
        color: #3f51b5;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      &.active:hover {
        background: rgba(63, 81, 181, 0.12);
      }
    }
  `]
})
export class LanguageSelectorComponent {
  readonly languageService = inject(LanguageService);

  /**
   * Texto del tooltip que cambia según el idioma actual
   */
  get tooltipText(): string {
    return this.languageService.isSpanish() ? 'Cambiar idioma' : 'Change language';
  }

  /**
   * Cambia el idioma de la aplicación
   */
  changeLanguage(languageCode: string): void {
    this.languageService.changeLanguage(languageCode);
  }
}