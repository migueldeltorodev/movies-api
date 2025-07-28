export const MESSAGES_ES = {
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
        previous: 'Anterior',
        select: 'Seleccionar',
        create: 'Crear',
        update: 'Actualizar',
        general: 'Información General',
        separate: 'Separar con',
        comma: 'comas'
    },

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

        infoTitle: 'Descubre el Cine',
        infoDescription: 'Únete a nuestra comunidad y descubre nuevas películas, califica tus favoritas y comparte tu pasión por el cine.',
        featureRate: 'Califica películas',
        featureDiscover: 'Descubre nuevos títulos',
        featureFavorites: 'Crea tu lista de favoritos',

        termsText: 'Al {action} aceptas nuestros',
        termsLink: 'Términos de Servicio',
        privacyLink: 'Política de Privacidad',
        loginAction: 'iniciar sesión',
        registerAction: 'registrarte'
    },

    movies: {
        title: 'Películas',
        subtitle: 'Descubre y califica tus películas favoritas',
        movieDetails: 'Detalles de la película',
        loadError: 'Error al cargar las películas',
        loadingMovie: 'Cargando película...',
        movieNotFound: 'Película no encontrada',
        movieNotFoundDescription: 'La película que buscas no existe o ha sido eliminada.',

        rateMovie: 'Calificar',
        rateSuccess: 'Película calificada exitosamente',
        rateError: 'Error al calificar la película',
        removeRating: 'Quitar',
        removeRatingSuccess: 'Calificación eliminada exitosamente',
        removeRatingError: 'Error al eliminar la calificación',
        yourRating: 'Tu calificación',
        yourRatingLabel: 'Tu calificación:',
        notRated: 'Sin calificar',

        share: 'Compartir',
        shareSuccess: 'Enlace de película copiado al portapapeles',
        shareError: 'No se pudo copiar el enlace',
        addToFavorites: 'Agregar a favoritos',
        removeFromFavorites: 'Quitar de favoritos',
        addedToFavorites: 'Película agregada a favoritos',
        removedFromFavorites: 'Película eliminada de favoritos',
        viewDetails: 'Ver detalles',
        backToMovies: 'Volver a películas',

        synopsis: 'Sinopsis',
        genres: 'Géneros',
        director: 'Director',
        releaseDate: 'Fecha de estreno',
        country: 'País',
        originalLanguage: 'Idioma original',
        duration: 'Duración',
        rating: 'Calificación',
        metadata: 'Metadatos',

        draft: 'Borrador',
        published: 'Publicada',
        archived: 'Archivada',
        changeStatus: 'Cambiar estado',
        publish: 'Publicar',
        archive: 'Archivar',

        noImage: 'Sin imagen',
        durationNotSpecified: 'Duración no especificada',
        releaseDateNotSpecified: 'Fecha de estreno no especificada',

        createMovie: 'Crear Película',
        editMovie: 'Editar Película',
        createSuccess: 'Película creada exitosamente',
        createError: 'Error al crear la película',
        updateSuccess: 'Película actualizada exitosamente',
        updateError: 'Error al actualizar la película',
        deleteSuccess: 'Película eliminada exitosamente',
        deleteError: 'Error al eliminar la película',

        // Form fields
        titleField: 'Título',
        descriptionField: 'Descripción',
        directorField: 'Director',
        yearField: 'Año de estreno',
        durationField: 'Duración (minutos)',
        releaseDateField: 'Fecha de estreno',
        countryField: 'País',
        originalLanguageField: 'Idioma original',
        ageRatingField: 'Clasificación por edad',
        genresField: 'Géneros',
        statusField: 'Estado',

        // Placeholders
        titlePlaceholder: 'Ingresa el título de la película',
        descriptionPlaceholder: 'Ingresa la descripción de la película',
        directorPlaceholder: 'Ingresa el nombre del director',
        yearPlaceholder: '2024',
        durationPlaceholder: '120',
        releaseDatePlaceholder: 'AAAA-MM-DD',
        countryPlaceholder: 'Estados Unidos',
        originalLanguagePlaceholder: 'Español',
        genresPlaceholder: 'Acción, Drama, Comedia',

        // Age ratings
        ageRatingG: 'G - Audiencias Generales',
        ageRatingPG: 'PG - Guía Parental',
        ageRatingPG13: 'PG-13 - Padres Fuertemente Advertidos',
        ageRatingR: 'R - Restringida',
        ageRatingNC17: 'NC-17 - Solo Adultos',

        noResults: 'No se encontraron películas que coincidan con tu búsqueda',
        noResultsDescription: 'Intenta ajustar tus filtros de búsqueda o explora nuestro catálogo completo.',
        viewAllMovies: 'Ver todas las películas',
        searchByTitle: 'Buscar por título',
        searchPlaceholder: 'Ej: Matrix, Avengers...',
        year: 'Año',
        sortBy: 'Ordenar por',
        activeFilters: 'Filtros activos:',
        titleLabel: 'Título',
        sort: 'Orden',

        // Sort options
        sortByTitle: 'Título',
        sortByYear: 'Año',
        sortByRating: 'Calificación',
        sortByUserRating: 'Mi Calificación'
    },

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

    empty: {
        noMovies: 'No hay películas disponibles',
        noFavorites: 'No tienes películas favoritas',
        noRatings: 'No has calificado ninguna película',
        noResults: 'No se encontraron resultados',
        noNotifications: 'No tienes notificaciones',
        noHistory: 'No hay historial disponible'
    },

    confirmations: {
        deleteMovie: '¿Estás seguro de que deseas eliminar esta película?',
        deleteRating: '¿Deseas eliminar tu calificación de esta película?',
        logout: '¿Estás seguro de que deseas cerrar sesión?',
        discardChanges: '¿Deseas descartar los cambios no guardados?',
        resetFilters: '¿Deseas limpiar todos los filtros aplicados?',
        clearData: '¿Estás seguro de que deseas limpiar todos los datos?'
    },

    rating: {
        veryBad: 'Muy mala',
        bad: 'Mala',
        regular: 'Regular',
        good: 'Buena',
        excellent: 'Excelente',
        unrated: 'Sin calificar',
        rate: 'Calificar',
        stars: 'estrellas'
    },

    permissions: {
        loginRequired: 'Debes iniciar sesión para realizar esta acción',
        trustedMemberRequired: 'Necesitas ser miembro de confianza para calificar películas',
        adminRequired: 'Necesitas permisos de administrador para realizar esta acción',
        insufficientPermissions: 'No tienes permisos suficientes para realizar esta acción'
    },

    app: {
        brandTitle: 'Movies Hub',
        changeLanguage: 'Cambiar idioma'
    }
} as const;