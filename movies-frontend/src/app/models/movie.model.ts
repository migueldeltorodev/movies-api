export interface Movie {
  id: string;
  title: string;
  slug: string;
  yearOfRelease: number;
  genres: string[];
  rating?: number;
  userRating?: number;
}

export interface MovieResponse {
  id: string;
  title: string;
  slug: string;
  yearOfRelease: number;
  genres: string[];
  rating?: number;
  userRating?: number;
}

export interface MoviesResponse {
  items: MovieResponse[];
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
}

export interface CreateMovieRequest {
  title: string;
  yearOfRelease: number;
  genres: string[];
}

export interface UpdateMovieRequest {
  title: string;
  yearOfRelease: number;
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

export interface ValidationFailureResponse {
  errors: { [key: string]: string[] };
}