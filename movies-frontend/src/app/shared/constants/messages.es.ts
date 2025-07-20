/**
 * Mensajes en español para la aplicación
 */

export const MESSAGES_ES = {
    // Mensajes generales
    general: {
        loading: 'Cargando...',
        saving: 'Guardando...',
        deleting: 'Eliminando...',
        processing: 'Procesando...',
        pleaseWait: 'Por favor, espera...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        close: 'Cerrar',
        save: 'Guardar',
        edit: 'Editar',
        delete: 'Eliminar',
        search: 'Buscar',
        filter: 'Filtrar',
        clear: 'Limpiar',
        back: 'Volver',
        next: 'Siguiente',
        previous: 'Anterior'
    },

    // Navegación
    nav: {
        movies: 'Películas',
        myRatings: 'Mis Calificaciones',
        admin: 'Admin',
        profile: 'Perfil',
        settings: 'Configuración',
        logout: 'Cerrar Sesión',
        login: 'Iniciar Sesión',
        trustedMember: 'Miembro'
    },

    // Autenticación
    auth: {
        loginTitle: 'Iniciar Sesión',
        registerTitle: 'Crear Cuenta',
        loginSubtitle: 'Accede a tu cuenta para calificar y descubrir películas',
        registerSubtitle: 'Únete a nuestra comunidad de amantes del cine',

        emailLabel: 'Correo electrónico',
        passwordLabel: 'Contraseña',
        confirmPasswordLabel: 'Confirmar contraseña',

        emailPlaceholder: 'tu@email.com',
        passwordPlaceholder: 'Tu contraseña',
        passwordMinPlaceholder: 'Mínimo 6 caracteres',
        confirmPasswordPlaceholder: 'Repite tu contraseña',

        loginButton: 'Iniciar Sesión',
        registerButton: 'Registrarse',
        loginLoading: 'Iniciando sesión...',
        registerLoading: 'Creando cuenta...',

        switchToRegister: '¿No tienes cuenta? Regístrate',
        switchToLogin: '¿Ya tienes cuenta? Inicia sesión',

        registerSuccess: '¡Cuenta creada exitosamente! Bienvenido a Movies Hub',
        loginSuccess: '¡Bienvenido de vuelta!',
        logoutSuccess: 'Sesión cerrada correctamente',

        showPasswordAriaLabel: 'Mostrar contraseña',
        hidePasswordAriaLabel: 'Ocultar contraseña',

        // Información lateral
        infoTitle: 'Descubre el Cine',
        infoDescription: 'Únete a nuestra comunidad y descubre nuevas películas, califica tus favoritas y comparte tu pasión por el cine.',
        featureRate: 'Califica películas',
        featureDiscover: 'Descubre nuevos títulos',
        featureFavorites: 'Crea tu lista de favoritos',

        // Footer
        termsText: 'Al {action} aceptas nuestros',
        termsLink: 'Términos de Servicio',
        privacyLink: 'Política de Privacidad',
        loginAction: 'iniciar sesión',
        registerAction: 'registrarte'
    },

    // Películas
    movies: {
        title: 'Películas',
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
    },

    // Validaciones
    validation: {
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
    },

    // Estados vacíos
    empty: {
        noMovies: 'No hay películas disponibles',
        noFavorites: 'No tienes películas favoritas',
        noRatings: 'No has calificado ninguna película',
        noResults: 'No se encontraron resultados',
        noNotifications: 'No tienes notificaciones',
        noHistory: 'No hay historial disponible'
    },

    // Confirmaciones
    confirmations: {
        deleteMovie: '¿Estás seguro de que deseas eliminar esta película?',
        deleteRating: '¿Deseas eliminar tu calificación de esta película?',
        logout: '¿Estás seguro de que deseas cerrar sesión?',
        discardChanges: '¿Deseas descartar los cambios no guardados?',
        resetFilters: '¿Deseas limpiar todos los filtros aplicados?',
        clearData: '¿Estás seguro de que deseas limpiar todos los datos?'
    },

    // Aplicación
    app: {
        brandTitle: 'Movies Hub',
        changeLanguage: 'Cambiar idioma'
    }
} as const;