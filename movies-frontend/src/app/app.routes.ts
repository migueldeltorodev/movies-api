import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage)
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movies/movies-list/movies-list.component').then(m => m.MoviesListComponent)
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./pages/movies/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent)
  },
  { path: '**', redirectTo: 'movies' }
];