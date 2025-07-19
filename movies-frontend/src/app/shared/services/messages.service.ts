import { Injectable, inject, computed } from '@angular/core';
import { LanguageService } from './language.service';
import { MESSAGES_ES } from '../constants/messages.es';
import { MESSAGES_EN } from '../constants/messages.en';

/**
 * Servicio de mensajes multiidioma
 * Proporciona los textos correctos según el idioma seleccionado
 * 
 * Patrón: Computed Signals para reactividad automática
 * Ventajas:
 * - Los mensajes se actualizan automáticamente al cambiar idioma
 * - Performance optimizada con memorización
 * - Type-safe con TypeScript
 * - Fácil de usar en componentes
 */
@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    private readonly languageService = inject(LanguageService);

    /**
     * Mensajes reactivos que cambian automáticamente con el idioma
     */
    readonly messages = computed(() => {
        const currentLang = this.languageService.currentLanguage().code;
        return currentLang === 'en' ? MESSAGES_EN : MESSAGES_ES;
    });

    /**
     * Accesos directos a secciones específicas de mensajes
     * Estos son computed signals que se actualizan automáticamente
     */
    readonly general = computed(() => this.messages().general);
    readonly nav = computed(() => this.messages().nav);
    readonly auth = computed(() => this.messages().auth);
    readonly movies = computed(() => this.messages().movies);
    readonly validation = computed(() => this.messages().validation);
    readonly empty = computed(() => this.messages().empty);
    readonly confirmations = computed(() => this.messages().confirmations);
    readonly app = computed(() => this.messages().app);

    /**
     * Función utilitaria para formatear mensajes con parámetros
     * @param template - Template del mensaje con placeholders {key}
     * @param params - Parámetros para reemplazar en el template
     * @returns Mensaje formateado
     * 
     * Ejemplo:
     * formatMessage(validation().minLength, { min: 5 })
     * // Resultado: "Debe tener al menos 5 caracteres" (ES) o "Must be at least 5 characters" (EN)
     */
    formatMessage(template: string, params: Record<string, string | number>): string {
        return template.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key]?.toString() || match;
        });
    }

    /**
     * Obtiene un mensaje específico por ruta
     * @param path - Ruta del mensaje (ej: 'auth.loginTitle')
     * @returns El mensaje en el idioma actual
     */
    getMessage(path: string): string {
        const keys = path.split('.');
        let current: any = this.messages();

        for (const key of keys) {
            current = current?.[key];
            if (current === undefined) {
                console.warn(`Message not found for path: ${path}`);
                return path; // Fallback al path si no se encuentra
            }
        }

        return current;
    }

    /**
     * Verifica si un mensaje existe
     * @param path - Ruta del mensaje
     * @returns true si el mensaje existe
     */
    hasMessage(path: string): boolean {
        const keys = path.split('.');
        let current: any = this.messages();

        for (const key of keys) {
            current = current?.[key];
            if (current === undefined) {
                return false;
            }
        }

        return typeof current === 'string';
    }
}