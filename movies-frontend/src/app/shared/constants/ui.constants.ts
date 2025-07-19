/**
 * Constantes relacionadas con la interfaz de usuario
 */

/**
 * Configuración de UI y experiencia de usuario
 */
export const UI_CONFIG = {
  animations: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1200
  },
  debounceTime: 300, // Para búsquedas
  snackbarDuration: {
    short: 2000,
    medium: 3000,
    long: 5000
  }
} as const;

/**
 * Configuración de temas y colores
 */
export const THEME_CONFIG = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  shadows: {
    light: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
    heavy: '0 8px 25px rgba(0, 0, 0, 0.15)'
  }
} as const;

/**
 * Configuración de iconos Material
 */
export const ICONS = {
  movie: 'movie',
  star: 'star',
  starBorder: 'star_border',
  search: 'search',
  filter: 'filter_list',
  sort: 'sort',
  menu: 'menu',
  close: 'close',
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  share: 'share',
  favorite: 'favorite',
  favoriteBorder: 'favorite_border',
  person: 'person',
  login: 'login',
  logout: 'logout',
  settings: 'settings',
  info: 'info',
  warning: 'warning',
  error: 'error',
  success: 'check_circle'
} as const;

/**
 * Tipos derivados para TypeScript
 */
export type IconName = typeof ICONS[keyof typeof ICONS];
export type ThemeColor = keyof typeof THEME_CONFIG.colors;