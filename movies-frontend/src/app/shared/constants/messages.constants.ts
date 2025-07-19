/**
 * Mensajes de la aplicación organizados por contexto
 */

/**
 * Mensajes relacionados con películas
 */
export const MOVIE_MESSAGES = {
  loadError: 'Error al cargar las películas',
  rateSuccess: 'Película calificada exitosamente',
  rateError: 'Error al calificar la película',
  createSuccess: 'Película creada exitosamente',
  createError: 'Error al crear la película',
  updateSuccess: 'Película actualizada exitosamente',
  updateError: 'Error al actualizar la película',
  deleteSuccess: 'Película eliminada exitosamente',
  deleteError: 'Error al eliminar la película',
  notFound: 'Película no encontrada',
  noResults: 'No se encontraron películas que coincidan con tu búsqueda',
  addedToFavorites: 'Película agregada a favoritos',
  removedFromFavorites: 'Película eliminada de favoritos',
  shareSuccess: 'Enlace de película copiado al portapapeles'
} as const;

/**
 * Mensajes generales del sistema
 */
export const GENERAL_MESSAGES = {
  networkError: 'Error de conexión. Verifica tu conexión a internet.',
  unexpectedError: 'Ha ocurrido un error inesperado. Inténtalo de nuevo.',
  noDataFound: 'No se encontraron datos',
  actionCompleted: 'Acción completada exitosamente',
  loading: 'Cargando...',
  saving: 'Guardando...',
  deleting: 'Eliminando...',
  processing: 'Procesando...',
  pleaseWait: 'Por favor, espera...',
  operationCancelled: 'Operación cancelada',
  dataUpdated: 'Datos actualizados correctamente'
} as const;

/**
 * Mensajes de validación de formularios
 */
export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  minLength: 'Debe tener al menos {min} caracteres',
  maxLength: 'No puede tener más de {max} caracteres',
  email: 'Debe ser un email válido',
  number: 'Debe ser un número válido',
  min: 'El valor mínimo es {min}',
  max: 'El valor máximo es {max}',
  pattern: 'El formato no es válido',
  passwordMismatch: 'Las contraseñas no coinciden',
  invalidDate: 'La fecha no es válida',
  futureDate: 'La fecha no puede ser futura',
  pastDate: 'La fecha no puede ser pasada'
} as const;

/**
 * Mensajes específicos de la página de autenticación
 */
export const AUTH_PAGE_MESSAGES = {
  // Títulos y subtítulos
  loginTitle: 'Iniciar Sesión',
  registerTitle: 'Crear Cuenta',
  loginSubtitle: 'Accede a tu cuenta para calificar y descubrir películas',
  registerSubtitle: 'Únete a nuestra comunidad de amantes del cine',
  
  // Botones
  loginButton: 'Iniciar Sesión',
  registerButton: 'Registrarse',
  loginLoading: 'Iniciando sesión...',
  registerLoading: 'Creando cuenta...',
  
  // Cambio de modo
  switchToRegister: '¿No tienes cuenta? Regístrate',
  switchToLogin: '¿Ya tienes cuenta? Inicia sesión',
  
  // Labels de formulario
  emailLabel: 'Correo electrónico',
  passwordLabel: 'Contraseña',
  confirmPasswordLabel: 'Confirmar contraseña',
  
  // Placeholders
  emailPlaceholder: 'tu@email.com',
  passwordPlaceholder: 'Tu contraseña',
  passwordMinPlaceholder: 'Mínimo 6 caracteres',
  confirmPasswordPlaceholder: 'Repite tu contraseña',
  
  // Mensajes de éxito
  registerSuccess: '¡Cuenta creada exitosamente! Bienvenido a Movies Hub',
  
  // Información lateral
  infoTitle: 'Descubre el Cine',
  infoDescription: 'Únete a nuestra comunidad y descubre nuevas películas, califica tus favoritas y comparte tu pasión por el cine.',
  
  // Características
  featureRate: 'Califica películas',
  featureDiscover: 'Descubre nuevos títulos',
  featureFavorites: 'Crea tu lista de favoritos',
  
  // Footer
  termsText: 'Al {action} aceptas nuestros',
  termsLink: 'Términos de Servicio',
  privacyLink: 'Política de Privacidad',
  loginAction: 'iniciar sesión',
  registerAction: 'registrarte',
  
  // Accesibilidad
  showPasswordAriaLabel: 'Mostrar contraseña',
  hidePasswordAriaLabel: 'Ocultar contraseña'
} as const;

/**
 * Mensajes de confirmación para acciones críticas
 */
export const CONFIRMATION_MESSAGES = {
  deleteMovie: '¿Estás seguro de que deseas eliminar esta película?',
  deleteRating: '¿Deseas eliminar tu calificación de esta película?',
  logout: '¿Estás seguro de que deseas cerrar sesión?',
  discardChanges: '¿Deseas descartar los cambios no guardados?',
  resetFilters: '¿Deseas limpiar todos los filtros aplicados?',
  clearData: '¿Estás seguro de que deseas limpiar todos los datos?'
} as const;

/**
 * Mensajes para estados vacíos
 */
export const EMPTY_STATE_MESSAGES = {
  noMovies: 'No hay películas disponibles',
  noFavorites: 'No tienes películas favoritas',
  noRatings: 'No has calificado ninguna película',
  noResults: 'No se encontraron resultados',
  noNotifications: 'No tienes notificaciones',
  noHistory: 'No hay historial disponible'
} as const;

/**
 * Función utilitaria para reemplazar placeholders en mensajes
 */
export function formatMessage(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

/**
 * Ejemplos de uso de formatMessage:
 * formatMessage(VALIDATION_MESSAGES.minLength, { min: 5 })
 * // Resultado: "Debe tener al menos 5 caracteres"
 */