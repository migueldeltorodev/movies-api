import { Injectable, inject, signal, computed, LOCALE_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Idiomas soportados por la aplicación
 */
export interface SupportedLanguage {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
}

/**
 * Servicio de gestión de idiomas usando Angular i18n
 * Maneja el cambio de idiomas de forma reactiva con Signals
 */
@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private readonly document = inject(DOCUMENT);
    private readonly currentLocale = inject(LOCALE_ID);

    /**
     * Idiomas soportados por la aplicación
     */
    readonly supportedLanguages: SupportedLanguage[] = [
        {
            code: 'es',
            name: 'Español',
            nativeName: 'Español',
            flag: '🇪🇸'
        },
        {
            code: 'en',
            name: 'English',
            nativeName: 'English',
            flag: '🇺🇸'
        }
    ];

    private readonly currentLanguageSignal = signal<SupportedLanguage>(
        this.getInitialLanguage()
    );

    readonly currentLanguage = this.currentLanguageSignal.asReadonly();

    readonly isSpanish = computed(() => this.currentLanguage().code === 'es');
    readonly isEnglish = computed(() => this.currentLanguage().code === 'en');
    readonly availableLanguages = computed(() =>
        this.supportedLanguages.filter(lang => lang.code !== this.currentLanguage().code)
    );

    /**
     * Cambia el idioma de la aplicación
     * Actualiza el signal y guarda la preferencia en localStorage
     * Compatible con SSR
     */
    changeLanguage(languageCode: string): void {
        const language = this.supportedLanguages.find(lang => lang.code === languageCode);

        if (!language) {
            console.warn(`Idioma no soportado: ${languageCode}`);
            return;
        }

        this.currentLanguageSignal.set(language);

        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.setItem('preferred-language', languageCode);
        }
    }

    /**
     * Obtiene el idioma inicial basado en preferencias guardadas o navegador
     * Compatible con SSR
     */
    private getInitialLanguage(): SupportedLanguage {
        // Verificar si estamos en el navegador (no en SSR)
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const savedLanguage = localStorage.getItem('preferred-language');
            if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
                return this.supportedLanguages.find(lang => lang.code === savedLanguage)!;
            }
        }

        const browserLanguage = this.getBrowserLanguage();
        return this.supportedLanguages.find(lang => lang.code === browserLanguage) || this.supportedLanguages[0];
    }

    /**
     * Obtiene el idioma preferido del navegador
     * Compatible con SSR
     */
    getBrowserLanguage(): string {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            const browserLang = navigator.language.split('-')[0];
            return this.supportedLanguages.some(lang => lang.code === browserLang)
                ? browserLang
                : 'es';
        }

        return this.currentLocale === 'en' ? 'en' : 'es';
    }

    /**
     * Verifica si un idioma está soportado
     */
    isLanguageSupported(languageCode: string): boolean {
        return this.supportedLanguages.some(lang => lang.code === languageCode);
    }

    /**
     * Obtiene la información de un idioma por su código
     */
    getLanguageInfo(languageCode: string): SupportedLanguage | undefined {
        return this.supportedLanguages.find(lang => lang.code === languageCode);
    }

    /**
     * Obtiene la URL para un idioma específico
     */
    getLanguageUrl(languageCode: string): string {
        const currentPath = this.document.location.pathname;

        if (languageCode === 'es') {
            return currentPath.replace(/^\/en/, '') || '/';
        } else {
            const cleanPath = currentPath.replace(/^\/en/, '') || '/';
            return `/${languageCode}${cleanPath}`;
        }
    }
}