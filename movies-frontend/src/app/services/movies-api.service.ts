import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Movie, 
  MoviesResponse, 
  CreateMovieRequest, 
  UpdateMovieRequest, 
  GetAllMoviesRequest,
  RateMovieRequest 
} from '../models/movie.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getMovies(request?: GetAllMoviesRequest): Observable<MoviesResponse> {
    let params = new HttpParams();
    
    if (request) {
      if (request.title) params = params.set('title', request.title);
      if (request.year) params = params.set('year', request.year.toString());
      if (request.sortBy) params = params.set('sortBy', request.sortBy);
      if (request.page) params = params.set('page', request.page.toString());
      if (request.pageSize) params = params.set('pageSize', request.pageSize.toString());
    }

    return this.http.get<MoviesResponse>(`${this.baseUrl}/api/movies/all`, { params });
  }

  getMovie(idOrSlug: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/api/movies/${idOrSlug}`);
  }

  createMovie(movie: CreateMovieRequest): Observable<Movie> {
    return this.http.post<Movie>(`${this.baseUrl}/api/movies`, movie);
  }

  updateMovie(id: string, movie: UpdateMovieRequest): Observable<Movie> {
    return this.http.put<Movie>(`${this.baseUrl}/api/movies/${id}`, movie);
  }

  deleteMovie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/movies/${id}`);
  }

  rateMovie(id: string, rating: RateMovieRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/movies/${id}/ratings`, rating);
  }

  deleteMovieRating(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/movies/${id}/ratings`);
  }

  getUserRatings(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/api/ratings/me`);
  }
}