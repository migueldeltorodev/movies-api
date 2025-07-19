import { Routes } from '@angular/router';
import { MoviesListComponent } from './pages/movies/movies-list/movies-list.component';
import { AuthPage } from './pages/auth/auth.page';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'auth', component: AuthPage },
  { path: 'movies', component: MoviesListComponent },
  { path: '**', redirectTo: 'movies' }
];