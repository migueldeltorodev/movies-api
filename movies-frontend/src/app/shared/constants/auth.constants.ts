export const AUTH_CONFIG = {
  tokenKey: 'movies_token',
  refreshTokenKey: 'movies_refresh_token',
  tokenExpirationBuffer: 300, // 5 minutos en segundos
  defaultUserId: 'd8566459-5958-45ff-b7d4-9486514a2897',
  defaultEmail: 'test@test.com'
} as const;

export const USER_ROLES = {
  public: 'Public',
  user: 'User',
  admin: 'Admin'
} as const;

export const AUTH_MESSAGES = {
  loginSuccess: '¡Bienvenido! Sesión iniciada exitosamente',
  loginError: 'Error al iniciar sesión. Verifica que el Identity API esté ejecutándose.',
  logoutSuccess: 'Sesión cerrada exitosamente',
  sessionExpired: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  insufficientPermissions: 'No tienes permisos suficientes para realizar esta acción',
  trustedMemberRequired: 'Necesitas ser un miembro de confianza para calificar películas'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];