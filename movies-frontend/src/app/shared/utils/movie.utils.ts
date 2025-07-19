/**
 * Utilidades compartidas para el manejo de películas
 * Evita duplicación de lógica en componentes
 */

/**
 * Colores para géneros de películas
 */
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

/**
 * Opciones de ordenamiento para películas
 */
export const SORT_OPTIONS = [
  { value: 'title', label: 'Título' },
  { value: 'yearOfRelease', label: 'Año' },
  { value: 'rating', label: 'Calificación' },
  { value: 'userRating', label: 'Mi Calificación' }
] as const;

/**
 * Tamaños de página disponibles
 */
export const PAGE_SIZE_OPTIONS = [6, 12, 24, 48] as const;

/**
 * Configuración por defecto para paginación
 */
export const DEFAULT_PAGE_CONFIG = {
  page: 0,
  pageSize: 12,
  pageSizeOptions: PAGE_SIZE_OPTIONS
} as const;

/**
 * Obtiene el color del chip según el género
 */
export function getGenreColor(genre: string): string {
  return GENRE_COLORS[genre] || 'primary';
}

/**
 * Genera un array de booleanos para mostrar estrellas
 */
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

/**
 * Formatea el año de lanzamiento
 */
export function formatYear(year: number): string {
  return year.toString();
}

/**
 * Formatea la calificación para mostrar
 */
export function formatRating(rating: number | undefined): string {
  if (!rating) return 'Sin calificar';
  return `${rating.toFixed(1)}/5`;
}

/**
 * Valida si una calificación es válida (1-5)
 */
export function isValidRating(rating: number): boolean {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}

/**
 * Obtiene el texto descriptivo de una calificación
 */
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

/**
 * Genera un slug a partir del título de una película
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Valida los datos básicos de una película
 */
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

/**
 * Filtra películas por texto de búsqueda
 */
export function filterMoviesBySearch(movies: any[], searchText: string): any[] {
  if (!searchText) return movies;
  
  const search = searchText.toLowerCase();
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(search) ||
    movie.genres.some((genre: string) => genre.toLowerCase().includes(search))
  );
}

/**
 * Ordena películas según el criterio especificado
 */
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