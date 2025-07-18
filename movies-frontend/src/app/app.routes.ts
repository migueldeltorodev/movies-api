import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MovieListComponent } from './pages/movies/movie-list/movie-list';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'movies', component: MovieListComponent }
];