import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  login() {
    console.log('Iniciando proceso de login...');
    this.authService.quickLogin().subscribe({
      next: () => {
        console.log('Login exitoso, redirigiendo a /movies');
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        console.error('Error durante el login:', err);
      }
    });
  }
}