export enum MovieStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
  Deleted = 3
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string;
  director?: string;
  durationMinutes?: number;
  formattedDuration?: string;
  yearOfRelease: number;
  releaseDate?: string;
  country?: string;
  originalLanguage?: string;
  posterUrl?: string;
  genres: string[];
  ageRating?: string; // G, PG, PG-13, R, NC-17
  rating?: number;
  userRating?: number;
  status: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MoviesResponse {
  items: Movie[];
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
}

export interface CreateMovieRequest {
  title: string;
  description: string;
  yearOfRelease: number;
  director?: string;
  durationMinutes?: number;
  releaseDate?: string;
  country?: string;
  originalLanguage?: string;
  ageRating?: string;
  genres: string[];
}

export interface UpdateMovieRequest {
  title: string;
  description: string;
  yearOfRelease: number;
  director?: string;
  durationMinutes?: number;
  releaseDate?: string;
  country?: string;
  originalLanguage?: string;
  ageRating?: string;
  status?: number;
  genres: string[];
}

export interface GetAllMoviesRequest {
  title?: string;
  year?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface RateMovieRequest {
  rating: number;
}

export interface ChangeMovieStatusRequest {
  status: MovieStatus;
}

export interface ValidationFailureResponse {
  errors: { [key: string]: string[] };
}