/**
 * English messages for the application
 */

export const MESSAGES_EN = {
    // General messages
    general: {
        loading: 'Loading...',
        saving: 'Saving...',
        deleting: 'Deleting...',
        processing: 'Processing...',
        pleaseWait: 'Please wait...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        filter: 'Filter',
        clear: 'Clear',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        select: 'Select',
        create: 'Create',
        update: 'Update',
        general: 'General Information',
        separate: 'Separate with',
        comma: 'commas'
    },

    // Navigation
    nav: {
        movies: 'Movies',
        myRatings: 'My Ratings',
        admin: 'Admin',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Sign Out',
        login: 'Sign In',
        trustedMember: 'Member'
    },

    // Authentication
    auth: {
        loginTitle: 'Sign In',
        registerTitle: 'Create Account',
        loginSubtitle: 'Access your account to rate and discover movies',
        registerSubtitle: 'Join our community of movie lovers',

        emailLabel: 'Email address',
        passwordLabel: 'Password',
        confirmPasswordLabel: 'Confirm password',

        emailPlaceholder: 'your@email.com',
        passwordPlaceholder: 'Your password',
        passwordMinPlaceholder: 'Minimum 6 characters',
        confirmPasswordPlaceholder: 'Repeat your password',

        loginButton: 'Sign In',
        registerButton: 'Sign Up',
        loginLoading: 'Signing in...',
        registerLoading: 'Creating account...',

        switchToRegister: "Don't have an account? Sign up",
        switchToLogin: 'Already have an account? Sign in',

        registerSuccess: 'Account created successfully! Welcome to Movies Hub',
        loginSuccess: 'Welcome back!',
        logoutSuccess: 'Successfully signed out',

        showPasswordAriaLabel: 'Show password',
        hidePasswordAriaLabel: 'Hide password',

        // Side information
        infoTitle: 'Discover Cinema',
        infoDescription: 'Join our community and discover new movies, rate your favorites and share your passion for cinema.',
        featureRate: 'Rate movies',
        featureDiscover: 'Discover new titles',
        featureFavorites: 'Create your favorites list',

        // Footer
        termsText: 'By {action} you accept our',
        termsLink: 'Terms of Service',
        privacyLink: 'Privacy Policy',
        loginAction: 'signing in',
        registerAction: 'signing up'
    },

    // Movies
    movies: {
        title: 'Movies',
        subtitle: 'Discover and rate your favorite movies',
        movieDetails: 'Movie Details',
        loadError: 'Error loading movies',
        loadingMovie: 'Loading movie...',
        movieNotFound: 'Movie not found',
        movieNotFoundDescription: 'The movie you are looking for does not exist or has been removed.',

        // Rating
        rateMovie: 'Rate Movie',
        rateSuccess: 'Movie rated successfully',
        rateError: 'Error rating movie',
        removeRating: 'Remove',
        removeRatingSuccess: 'Rating removed successfully',
        removeRatingError: 'Error removing rating',
        yourRating: 'Your Rating',
        yourRatingLabel: 'Your rating:',
        notRated: 'Not rated',

        // Actions
        share: 'Share',
        shareSuccess: 'Movie link copied to clipboard',
        shareError: 'Could not copy link',
        addToFavorites: 'Add to favorites',
        removeFromFavorites: 'Remove from favorites',
        addedToFavorites: 'Movie added to favorites',
        removedFromFavorites: 'Movie removed from favorites',
        viewDetails: 'View details',
        backToMovies: 'Back to Movies',

        // Movie info
        synopsis: 'Synopsis',
        genres: 'Genres',
        director: 'Director',
        releaseDate: 'Release Date',
        country: 'Country',
        originalLanguage: 'Original Language',
        duration: 'Duration',
        rating: 'Rating',
        metadata: 'Metadata',

        // Status
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived',
        changeStatus: 'Change status',
        publish: 'Publish',
        archive: 'Archive',

        // Placeholders
        noImage: 'No image',
        durationNotSpecified: 'Duration not specified',
        releaseDateNotSpecified: 'Release date not specified',

        // CRUD
        createMovie: 'Create Movie',
        editMovie: 'Edit Movie',
        createSuccess: 'Movie created successfully',
        createError: 'Error creating movie',
        updateSuccess: 'Movie updated successfully',
        updateError: 'Error updating movie',
        deleteSuccess: 'Movie deleted successfully',
        deleteError: 'Error deleting movie',

        // Form fields
        titleField: 'Title',
        descriptionField: 'Description',
        directorField: 'Director',
        yearField: 'Year of Release',
        durationField: 'Duration (minutes)',
        releaseDateField: 'Release Date',
        countryField: 'Country',
        originalLanguageField: 'Original Language',
        ageRatingField: 'Age Rating',
        genresField: 'Genres',
        statusField: 'Status',

        // Placeholders
        titlePlaceholder: 'Enter movie title',
        descriptionPlaceholder: 'Enter movie description',
        directorPlaceholder: 'Enter director name',
        yearPlaceholder: '2024',
        durationPlaceholder: '120',
        releaseDatePlaceholder: 'YYYY-MM-DD',
        countryPlaceholder: 'United States',
        originalLanguagePlaceholder: 'English',
        genresPlaceholder: 'Action, Drama, Comedy',

        // Age ratings
        ageRatingG: 'G - General Audiences',
        ageRatingPG: 'PG - Parental Guidance',
        ageRatingPG13: 'PG-13 - Parents Strongly Cautioned',
        ageRatingR: 'R - Restricted',
        ageRatingNC17: 'NC-17 - Adults Only',

        // Search and filters
        noResults: 'No movies found matching your search',
        noResultsDescription: 'Try adjusting your search filters or explore our complete catalog.',
        viewAllMovies: 'View all movies',
        searchByTitle: 'Search by title',
        searchPlaceholder: 'Ex: Matrix, Avengers...',
        year: 'Year',
        sortBy: 'Sort by',
        activeFilters: 'Active filters:',
        titleLabel: 'Title',
        sort: 'Sort',

        // Sort options
        sortByTitle: 'Title',
        sortByYear: 'Year',
        sortByRating: 'Rating',
        sortByUserRating: 'My Rating'
    },

    // Validations
    validation: {
        required: 'This field is required',
        minLength: 'Must be at least {min} characters',
        maxLength: 'Cannot be more than {max} characters',
        email: 'Must be a valid email',
        number: 'Must be a valid number',
        min: 'Minimum value is {min}',
        max: 'Maximum value is {max}',
        pattern: 'Format is not valid',
        passwordMismatch: 'Passwords do not match',
        invalidDate: 'Date is not valid',
        futureDate: 'Date cannot be in the future',
        pastDate: 'Date cannot be in the past'
    },

    // Empty states
    empty: {
        noMovies: 'No movies available',
        noFavorites: 'You have no favorite movies',
        noRatings: 'You have not rated any movies',
        noResults: 'No results found',
        noNotifications: 'You have no notifications',
        noHistory: 'No history available'
    },

    // Confirmations
    confirmations: {
        deleteMovie: 'Are you sure you want to delete this movie?',
        deleteRating: 'Do you want to remove your rating for this movie?',
        logout: 'Are you sure you want to sign out?',
        discardChanges: 'Do you want to discard unsaved changes?',
        resetFilters: 'Do you want to clear all applied filters?',
        clearData: 'Are you sure you want to clear all data?'
    },

    // Rating
    rating: {
        veryBad: 'Very bad',
        bad: 'Bad',
        regular: 'Regular',
        good: 'Good',
        excellent: 'Excellent',
        unrated: 'Unrated',
        rate: 'Rate',
        stars: 'stars'
    },

    // Permissions and roles
    permissions: {
        loginRequired: 'You must sign in to perform this action',
        trustedMemberRequired: 'You need to be a trusted member to rate movies',
        adminRequired: 'You need administrator permissions to perform this action',
        insufficientPermissions: 'You do not have sufficient permissions to perform this action'
    },

    // Application
    app: {
        brandTitle: 'Movies Hub',
        changeLanguage: 'Change language'
    }
} as const;