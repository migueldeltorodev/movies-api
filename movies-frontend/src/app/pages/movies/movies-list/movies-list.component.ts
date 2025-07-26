import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {retry, delay, catchError, of} from 'rxjs';
import { MovieCardComponent, MovieFilters } from '../../../components';
import { MovieFiltersComponent } from '../../../components';

import {
    CORE_IMPORTS,
    MATERIAL_IMPORTS,
    NotificationService,
    MessagesService,
    DEFAULT_PAGE_CONFIG,
} from '../../../shared';

import { LanguageService } from '../../../shared/services/language.service';

import { MoviesApiService } from '../../../services/movies-api.service';
import { AuthService } from '../../../services/auth.service';
import { Movie, GetAllMoviesRequest } from '../../../models/movie.model';

@Component({
    selector: 'app-movies-list',
    standalone: true,
    imports: [
        ...CORE_IMPORTS,
        ...MATERIAL_IMPORTS,
        MovieCardComponent,
        MovieFiltersComponent
    ],
    templateUrl: './movies-list.component.html',
    styleUrl: './movies-list.component.scss'
})
export class MoviesListComponent implements OnInit {
    private readonly moviesApi = inject(MoviesApiService);
    private readonly notification = inject(NotificationService);
    private readonly messagesService = inject(MessagesService);
    readonly languageService = inject(LanguageService);
    readonly authService = inject(AuthService);

    readonly messages = this.messagesService.movies;
    readonly generalMessages = this.messagesService.general;
    readonly emptyMessages = this.messagesService.empty;

    readonly movies = signal<Movie[]>([]);
    readonly isLoading = signal(false);
    readonly totalMovies = signal(0);
    readonly currentPage = signal(0);
    readonly pageSize = signal<number>(DEFAULT_PAGE_CONFIG.pageSize);

    readonly currentFilters = signal<MovieFilters>({ sortBy: 'title' });

    readonly hasMovies = computed(() => this.movies().length > 0);
    // readonly showPagination = computed(() => this.totalMovies() > this.pageSize());
    readonly pageSizeOptions = DEFAULT_PAGE_CONFIG.pageSizeOptions;

    ngOnInit() {
        this.loadMovies();
    }

    /**
     * Carga las películas con los filtros actuales
     */
    loadMovies() {
        this.isLoading.set(true);

        const filters = this.currentFilters();
        const request: GetAllMoviesRequest = {
            title: filters.title || undefined,
            year: filters.year || undefined,
            sortBy: filters.sortBy || 'title',
            page: this.currentPage() + 1,
            pageSize: this.pageSize()
        };

        this.moviesApi.getMovies(request).subscribe({
            next: (response) => {
                this.movies.set(response.items);
                this.totalMovies.set(response.total);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.notification.error(this.messages().loadError);
                this.isLoading.set(false);
            }
        });
    }

    /**
     * Maneja el cambio de página
     */
    onPageChange(event: PageEvent) {
        this.currentPage.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.loadMovies();
    }

    /**
     * Maneja la aplicación de filtros desde el componente de filtros
     */
    onFiltersApplied(filters: MovieFilters) {
        this.currentFilters.set(filters);
        this.currentPage.set(0);
        this.loadMovies();
    }

    /**
     * Maneja la limpieza de filtros
     */
    onFiltersCleared() {
        this.currentFilters.set({ sortBy: 'title' });
        this.currentPage.set(0);
        this.loadMovies();
    }

    /**
     * Maneja la calificación desde el componente de tarjeta
     */
    onMovieRated(event: { movieId: string; rating: number }) {
        if (!this.authService.isTrustedMember()) {
            this.notification.warning('Necesitas ser miembro de confianza para calificar películas');
            return;
        }

        this.moviesApi.rateMovie(event.movieId, { rating: event.rating }).subscribe({
            next: () => {
                this.notification.success(this.messages().rateSuccess);
                this.loadMovies();
            },
            error: (error) => {
                console.error('Error rating movie:', error);
                this.notification.error(this.messages().rateError);
            }
        });
    }

    /**
     * Maneja la visualización de detalles de película
     */
    onMovieDetailsRequested(movie: Movie) {
        // TODO: Implementar navegación a detalles
        console.log('View details for movie:', movie.title);
    }

    /**
     * Maneja el compartir película
     */
    onMovieShared(movie: Movie) {
        // TODO: Implementar funcionalidad de compartir
        this.notification.success(this.messages().shareSuccess);
    }

    /**
     * Maneja agregar a favoritos
     */
    onMovieFavorited(movie: Movie) {
        // TODO: Implementar funcionalidad de favoritos
        this.notification.success(this.messages().addedToFavorites);
    }
}
