import { Component, inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CORE_IMPORTS, MATERIAL_IMPORTS } from '../../shared/material.imports';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, RegisterRequest } from '../../models/auth.model';
import { VALIDATION_MESSAGES, AUTH_PAGE_MESSAGES, ROUTES, formatMessage } from '../../shared/constants';

/**
 * Página de autenticación production-ready
 * Maneja login y registro de usuarios
 */
@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    ...CORE_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss'
})
export class AuthPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);

  readonly isLoginMode = signal(true);
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);

  // Computed signals usando constantes
  readonly pageTitle = computed(() =>
    this.isLoginMode() ? AUTH_PAGE_MESSAGES.loginTitle : AUTH_PAGE_MESSAGES.registerTitle
  );
  readonly pageSubtitle = computed(() =>
    this.isLoginMode() ? AUTH_PAGE_MESSAGES.loginSubtitle : AUTH_PAGE_MESSAGES.registerSubtitle
  );
  readonly submitButtonText = computed(() =>
    this.isLoginMode() ? AUTH_PAGE_MESSAGES.loginButton : AUTH_PAGE_MESSAGES.registerButton
  );
  readonly loadingButtonText = computed(() =>
    this.isLoginMode() ? AUTH_PAGE_MESSAGES.loginLoading : AUTH_PAGE_MESSAGES.registerLoading
  );
  readonly switchModeText = computed(() =>
    this.isLoginMode() ? AUTH_PAGE_MESSAGES.switchToRegister : AUTH_PAGE_MESSAGES.switchToLogin
  );
  readonly termsText = computed(() => {
    const action = this.isLoginMode() ? AUTH_PAGE_MESSAGES.loginAction : AUTH_PAGE_MESSAGES.registerAction;
    return formatMessage(AUTH_PAGE_MESSAGES.termsText, { action });
  });

  // Constantes disponibles en el template
  readonly messages = AUTH_PAGE_MESSAGES;
  readonly validationMessages = VALIDATION_MESSAGES;

  readonly loginForm: FormGroup;
  readonly registerForm: FormGroup;

  readonly isLoading = this.authService.isLoading;
  readonly authError = this.authService.error;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    effect(() => {
      this.isLoginMode();
      this.authService.clearError();
    });
  }

  /**
   * Alterna entre modo login y registro
   */
  toggleMode() {
    this.isLoginMode.update(current => !current);
    this.resetForms();
  }

  /**
   * Maneja el envío del formulario de login
   */
  onLoginSubmit() {
    if (this.loginForm.valid) {
      const request: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(request).subscribe({
        next: () => {
          this.notification.messages.loginSuccess();
          this.router.navigate([ROUTES.movies]);
        },
        error: () => {
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  /**
   * Maneja el envío del formulario de registro
   */
  onRegisterSubmit() {
    if (this.registerForm.valid) {
      const request: RegisterRequest = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(request).subscribe({
        next: () => {
          this.notification.success(AUTH_PAGE_MESSAGES.registerSuccess);
          this.router.navigate([ROUTES.movies]);
        },
        error: () => {
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return VALIDATION_MESSAGES.required;
      }
      if (field.errors['email']) {
        return VALIDATION_MESSAGES.email;
      }
      if (field.errors['minlength']) {
        return formatMessage(VALIDATION_MESSAGES.minLength, {
          min: field.errors['minlength'].requiredLength
        });
      }
      if (field.errors['passwordMismatch']) {
        return VALIDATION_MESSAGES.passwordMismatch;
      }
    }
    return '';
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasFieldError(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Validador personalizado para confirmar contraseña
   */
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  /**
   * Marca todos los campos del formulario como tocados
   */
  private markFormGroupTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Resetea los formularios
   */
  private resetForms() {
    this.loginForm.reset();
    this.registerForm.reset();
    this.authService.clearError();
  }
}