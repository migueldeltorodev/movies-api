/**
 * Constantes de rutas y navegación
 */

/**
 * Rutas principales de la aplicación
 */
export const ROUTES = {
  home: '/',
  auth: '/auth',
  movies: '/movies',
  movieDetail: '/movies/:id',
  myRatings: '/my-ratings',
  favorites: '/favorites',
  admin: '/admin',
  profile: '/profile',
  settings: '/settings',
  about: '/about',
  contact: '/contact'
} as const;

/**
 * Rutas de administración
 */
export const ADMIN_ROUTES = {
  dashboard: '/admin',
  movies: '/admin/movies',
  users: '/admin/users',
  analytics: '/admin/analytics',
  settings: '/admin/settings'
} as const;

/**
 * Rutas de perfil de usuario
 */
export const PROFILE_ROUTES = {
  overview: '/profile',
  ratings: '/profile/ratings',
  favorites: '/profile/favorites',
  settings: '/profile/settings',
  security: '/profile/security'
} as const;

/**
 * Parámetros de ruta comunes
 */
export const ROUTE_PARAMS = {
  movieId: 'id',
  userId: 'userId',
  page: 'page',
  category: 'category'
} as const;

/**
 * Query parameters comunes
 */
export const QUERY_PARAMS = {
  search: 'search',
  filter: 'filter',
  sort: 'sort',
  page: 'page',
  pageSize: 'pageSize',
  year: 'year',
  genre: 'genre'
} as const;

/**
 * Funciones utilitarias para construcción de rutas
 */
export const RouteUtils = {
  /**
   * Construye la ruta de detalle de película
   */
  movieDetail: (movieId: string): string => {
    return ROUTES.movieDetail.replace(':id', movieId);
  },

  /**
   * Construye la ruta de perfil de usuario
   */
  userProfile: (userId: string): string => {
    return `/profile/${userId}`;
  },

  /**
   * Construye URL con query parameters
   */
  withQueryParams: (baseRoute: string, params: Record<string, string | number>): string => {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    return queryString ? `${baseRoute}?${queryString}` : baseRoute;
  },

  /**
   * Verifica si una ruta requiere autenticación
   */
  requiresAuth: (route: string): boolean => {
    const protectedRoutes = [
      ROUTES.myRatings,
      ROUTES.favorites,
      ROUTES.profile,
      ROUTES.admin
    ];
    return protectedRoutes.some(protectedRoute => route.startsWith(protectedRoute));
  },

  /**
   * Verifica si una ruta requiere permisos de admin
   */
  requiresAdmin: (route: string): boolean => {
    return route.startsWith(ROUTES.admin);
  }
} as const;

/**
 * Tipos derivados para TypeScript
 */
export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
export type AdminRoute = typeof ADMIN_ROUTES[keyof typeof ADMIN_ROUTES];
export type ProfileRoute = typeof PROFILE_ROUTES[keyof typeof PROFILE_ROUTES];