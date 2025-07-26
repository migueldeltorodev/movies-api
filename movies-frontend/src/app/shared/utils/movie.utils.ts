import { Movie, MovieResponse, MovieStatus } from "../../models";

export const GENRE_COLORS: Record<string, string> = {
  'Action': 'accent',
  'Adventure': 'primary',
  'Comedy': 'primary',
  'Drama': 'warn',
  'Horror': 'accent',
  'Romance': 'primary',
  'Sci-Fi': 'accent',
  'Thriller': 'warn',
  'Fantasy': 'primary',
  'Mystery': 'accent',
  'Crime': 'warn',
  'Animation': 'primary',
  'Family': 'primary',
  'Documentary': 'accent',
  'Biography': 'warn',
  'History': 'accent',
  'War': 'warn',
  'Western': 'accent',
  'Musical': 'primary',
  'Sport': 'accent'
} as const;

export const SORT_OPTIONS = [
  { value: 'title', label: 'Título' },
  { value: 'yearofrelease', label: 'Año' }
] as const;

export const PAGE_SIZE_OPTIONS = [6, 12, 24] as const;

export const DEFAULT_PAGE_CONFIG = {
  page: 0,
  pageSize: 12,
  pageSizeOptions: PAGE_SIZE_OPTIONS
} as const;

export function getGenreColor(genre: string): string {
  return GENRE_COLORS[genre] || 'primary';
}

export function getStarsArray(rating: number | undefined): boolean[] {
  const stars = new Array(5).fill(false);
  if (rating) {
    const filledStars = Math.floor(rating);
    for (let i = 0; i < filledStars && i < 5; i++) {
      stars[i] = true;
    }
  }
  return stars;
}

export function formatDuration(durationMinutes?: number): string {
  if (!durationMinutes || durationMinutes <= 0) {
    return 'Duration not specified';
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

export function formatReleaseDate(releaseDate?: string): string {
  if (!releaseDate) return 'Release date not specified';

  try {
    const date = new Date(releaseDate);
    return date.toLocaleDateString();
  } catch {
    return 'Invalid date';
  }
}

export function formatYear(year: number): string {
  return year.toString();
}

export function formatRating(rating: number | undefined): string {
  if (!rating) return 'Sin calificar';
  return `${rating.toFixed(1)}/5`;
}

export function isValidRating(rating: number): boolean {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}

export function getRatingText(rating: number): string {
  const ratingTexts: Record<number, string> = {
    1: 'Muy mala',
    2: 'Mala',
    3: 'Regular',
    4: 'Buena',
    5: 'Excelente'
  };
  return ratingTexts[rating] || 'Sin calificar';
}

export function validateMovieData(title: string, year: number, genres: string[]): string[] {
  const errors: string[] = [];

  if (!title || title.trim().length < 2) {
    errors.push('El título debe tener al menos 2 caracteres');
  }

  const currentYear = new Date().getFullYear();
  if (!year || year < 1900 || year > currentYear + 5) {
    errors.push(`El año debe estar entre 1900 y ${currentYear + 5}`);
  }

  if (!genres || genres.length === 0) {
    errors.push('Debe seleccionar al menos un género');
  }

  return errors;
}

export function filterMoviesBySearch(movies: any[], searchText: string): any[] {
  if (!searchText) return movies;

  const search = searchText.toLowerCase();
  return movies.filter(movie =>
    movie.title.toLowerCase().includes(search) ||
    movie.genres.some((genre: string) => genre.toLowerCase().includes(search))
  );
}

export function sortMovies(movies: any[], sortBy: string): any[] {
  return [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'yearOfRelease':
        return b.yearOfRelease - a.yearOfRelease;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'userRating':
        return (b.userRating || 0) - (a.userRating || 0);
      default:
        return 0;
    }
  });
}

export function getMovieStatus(status: number): MovieStatus {
  return status as MovieStatus;
}

export function getStatusName(status: MovieStatus): string {
  switch (status) {
    case MovieStatus.Draft:
      return 'Draft';
    case MovieStatus.Published:
      return 'Published';
    case MovieStatus.Archived:
      return 'Archived';
    case MovieStatus.Deleted:
      return 'Deleted';
    default:
      return 'Unknown';
  }
}

export function isPublished(movie: Movie | MovieResponse): boolean {
  return movie.isPublished || movie.status === MovieStatus.Published;
}