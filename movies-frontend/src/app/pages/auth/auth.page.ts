import { Component, inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CORE_IMPORTS, MATERIAL_IMPORTS } from '../../shared/material.imports';
import { NotificationService } from '../../shared/services/notification.service';
import { MessagesService } from '../../shared';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, RegisterRequest } from '../../models/auth.model';
import { ROUTES } from '../../shared/constants';

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
  private readonly messagesService = inject(MessagesService);

  readonly isLoginMode = signal(true);
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);

  // Computed signals reactivos que cambian automáticamente con el idioma
  readonly pageTitle = computed(() =>
    this.isLoginMode() ? this.messagesService.auth().loginTitle : this.messagesService.auth().registerTitle
  );
  readonly pageSubtitle = computed(() =>
    this.isLoginMode() ? this.messagesService.auth().loginSubtitle : this.messagesService.auth().registerSubtitle
  );
  readonly submitButtonText = computed(() =>
    this.isLoginMode() ? this.messagesService.auth().loginButton : this.messagesService.auth().registerButton
  );
  readonly loadingButtonText = computed(() =>
    this.isLoginMode() ? this.messagesService.auth().loginLoading : this.messagesService.auth().registerLoading
  );
  readonly switchModeText = computed(() =>
    this.isLoginMode() ? this.messagesService.auth().switchToRegister : this.messagesService.auth().switchToLogin
  );
  readonly termsText = computed(() => {
    const action = this.isLoginMode() ? this.messagesService.auth().loginAction : this.messagesService.auth().registerAction;
    return this.messagesService.formatMessage(this.messagesService.auth().termsText, { action });
  });

  // Mensajes reactivos disponibles en el template
  readonly messages = this.messagesService.auth;
  readonly validationMessages = this.messagesService.validation;

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
          this.notification.success(this.messagesService.auth().registerSuccess);
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
   * Ahora usa el sistema de mensajes multiidioma
   */
  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return this.messagesService.validation().required;
      }
      if (field.errors['email']) {
        return this.messagesService.validation().email;
      }
      if (field.errors['minlength']) {
        return this.messagesService.formatMessage(this.messagesService.validation().minLength, {
          min: field.errors['minlength'].requiredLength
        });
      }
      if (field.errors['passwordMismatch']) {
        return this.messagesService.validation().passwordMismatch;
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