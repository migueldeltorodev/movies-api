import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AUTH_MESSAGES, MOVIE_MESSAGES, GENERAL_MESSAGES } from '../constants';

/**
 * Tipos de notificación disponibles
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Configuración de notificación
 */
export interface NotificationConfig {
  message: string;
  action?: string;
  duration?: number;
  type?: NotificationType;
}

/**
 * Servicio centralizado para manejo de notificaciones
 * Evita duplicación de código de snackbars
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  /**
   * Configuraciones predeterminadas por tipo
   */
  private readonly defaultConfigs: Record<NotificationType, Partial<MatSnackBarConfig>> = {
    success: {
      duration: 3000,
      panelClass: ['success-snackbar']
    },
    error: {
      duration: 5000,
      panelClass: ['error-snackbar']
    },
    warning: {
      duration: 4000,
      panelClass: ['warning-snackbar']
    },
    info: {
      duration: 3000,
      panelClass: ['info-snackbar']
    }
  };

  /**
   * Muestra una notificación
   */
  show(config: NotificationConfig) {
    const type = config.type || 'info';
    const defaultConfig = this.defaultConfigs[type];
    
    const snackBarConfig: MatSnackBarConfig = {
      ...defaultConfig,
      duration: config.duration || defaultConfig.duration
    };

    return this.snackBar.open(
      config.message,
      config.action || 'Cerrar',
      snackBarConfig
    );
  }

  /**
   * Notificación de éxito
   */
  success(message: string, action?: string, duration?: number) {
    return this.show({
      message,
      action,
      duration,
      type: 'success'
    });
  }

  /**
   * Notificación de error
   */
  error(message: string, action?: string, duration?: number) {
    return this.show({
      message,
      action,
      duration,
      type: 'error'
    });
  }

  /**
   * Notificación de advertencia
   */
  warning(message: string, action?: string, duration?: number) {
    return this.show({
      message,
      action,
      duration,
      type: 'warning'
    });
  }

  /**
   * Notificación informativa
   */
  info(message: string, action?: string, duration?: number) {
    return this.show({
      message,
      action,
      duration,
      type: 'info'
    });
  }

  /**
   * Mensajes predefinidos usando constantes organizadas
   */
  readonly messages = {
    // Autenticación
    loginSuccess: () => this.success(AUTH_MESSAGES.loginSuccess),
    loginError: () => this.error(AUTH_MESSAGES.loginError),
    logoutSuccess: () => this.success(AUTH_MESSAGES.logoutSuccess),
    
    // Películas
    moviesLoadError: () => this.error(MOVIE_MESSAGES.loadError),
    movieRateSuccess: () => this.success(MOVIE_MESSAGES.rateSuccess),
    movieRateError: () => this.error(MOVIE_MESSAGES.rateError),
    movieCreateSuccess: () => this.success(MOVIE_MESSAGES.createSuccess),
    movieUpdateSuccess: () => this.success(MOVIE_MESSAGES.updateSuccess),
    movieDeleteSuccess: () => this.success(MOVIE_MESSAGES.deleteSuccess),
    
    // Permisos
    insufficientPermissions: () => this.warning(AUTH_MESSAGES.insufficientPermissions),
    trustedMemberRequired: () => this.warning(AUTH_MESSAGES.trustedMemberRequired),
    
    // General
    networkError: () => this.error(GENERAL_MESSAGES.networkError),
    unexpectedError: () => this.error(GENERAL_MESSAGES.unexpectedError),
    noDataFound: () => this.info(GENERAL_MESSAGES.noDataFound),
    actionCompleted: () => this.success(GENERAL_MESSAGES.actionCompleted)
  };
}