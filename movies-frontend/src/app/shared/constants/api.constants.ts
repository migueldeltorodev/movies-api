/**
 * Constantes relacionadas con la comunicación API
 */

/**
 * Configuración de endpoints y API
 */
export const API_CONFIG = {
  endpoints: {
    movies: '/api/movies',
    moviesAll: '/api/movies/all',
    ratings: '/api/ratings',
    userRatings: '/api/ratings/me',
    token: '/token'
  },
  defaultPageSize: 12,
  maxPageSize: 100,
  timeouts: {
    default: 30000, // 30 segundos
    upload: 120000, // 2 minutos
    download: 60000 // 1 minuto
  }
} as const;

/**
 * Estados de carga para operaciones asíncronas
 */
export const LOADING_STATES = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error'
} as const;

/**
 * Códigos de estado HTTP más comunes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

/**
 * Tipos derivados para TypeScript
 */
export type LoadingState = typeof LOADING_STATES[keyof typeof LOADING_STATES];
export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];