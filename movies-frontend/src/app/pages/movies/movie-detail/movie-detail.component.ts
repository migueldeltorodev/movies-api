import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, catchError, of } from 'rxjs';

import {
    CORE_IMPORTS,
    MATERIAL_IMPORTS,
    NotificationService,
    MessagesService,
    ROUTES
} from '../../../shared';

import { LanguageService } from '../../../shared/services/language.service';
import { MoviesApiService } from '../../../services/movies-api.service';
import { AuthService } from '../../../services/auth.service';
import { Movie, MovieStatus } from '../../../models';
import {
    formatDuration,
    formatReleaseDate,
    getStarsArray,
    getGenreColor,
    getRatingText,
    getStatusName,
    isPublished
} from '../../../shared/utils/movie.utils';

@Component({
    selector: 'app-movie-detail',
    standalone: true,
    imports: [
        ...CORE_IMPORTS,
        ...MATERIAL_IMPORTS
    ],
    templateUrl: './movie-detail.component.html',
    styleUrl: './movie-detail.component.scss'
})
export class MovieDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly moviesApi = inject(MoviesApiService);
    private readonly notification = inject(NotificationService);
    private readonly messagesService = inject(MessagesService);
    readonly languageService = inject(LanguageService);
    readonly authService = inject(AuthService);

    readonly messages = this.messagesService.movies;
    readonly generalMessages = this.messagesService.general;

    readonly movie = signal<Movie | null>(null);
    readonly isLoading = signal(true);
    readonly isRating = signal(false);
    readonly selectedRating = signal<number>(0);

    readonly hasMovie = computed(() => this.movie() !== null);
    readonly canRate = computed(() => this.authService.isTrustedMember() && this.hasMovie());
    readonly canEdit = computed(() => this.authService.isAdmin() && this.hasMovie());
    readonly movieStatus = computed(() => {
        const movie = this.movie();
        return movie ? getStatusName(movie.status as MovieStatus) : '';
    });

    readonly formatDuration = formatDuration;
    readonly formatReleaseDate = formatReleaseDate;
    readonly getStarsArray = getStarsArray;
    readonly getGenreColor = getGenreColor;
    readonly getRatingText = getRatingText;
    readonly isPublished = isPublished;

    ngOnInit() {
        this.loadMovieFromRoute();
    }

    private loadMovieFromRoute() {
        this.route.params.pipe(
            switchMap(params => {
                const movieId = params['id'];
                if (!movieId) {
                    this.router.navigate([ROUTES.movies]);
                    return of(null);
                }
                return this.moviesApi.getMovie(movieId);
            }),
            catchError(error => {
                console.error('Error loading movie:', error);
                this.notification.error(this.messages().loadError);
                this.router.navigate([ROUTES.movies]);
                return of(null);
            })
        ).subscribe(movie => {
            this.movie.set(movie);
            this.isLoading.set(false);

            if (movie?.userRating) {
                this.selectedRating.set(movie.userRating);
            }
        });
    }

    onRateMovie(rating: number) {
        const movie = this.movie();
        if (!movie || !this.canRate()) return;

        this.isRating.set(true);
        this.selectedRating.set(rating);

        this.moviesApi.rateMovie(movie.id, { rating }).subscribe({
            next: () => {
                this.notification.success(this.messages().rateSuccess);
                this.loadMovieFromRoute();
                this.isRating.set(false);
            },
            error: (error) => {
                console.error('Error rating movie:', error);
                this.notification.error(this.messages().rateError);
                this.selectedRating.set(movie.userRating || 0);
                this.isRating.set(false);
            }
        });
    }

    onRemoveRating() {
        const movie = this.movie();
        if (!movie || !movie.userRating) return;

        this.isRating.set(true);

        this.moviesApi.deleteMovieRating(movie.id).subscribe({
            next: () => {
                this.notification.success('Rating removed successfully');
                this.selectedRating.set(0);
                this.loadMovieFromRoute();
                this.isRating.set(false);
            },
            error: (error) => {
                console.error('Error removing rating:', error);
                this.notification.error('Error removing rating');
                this.isRating.set(false);
            }
        });
    }

    onEditMovie() {
        const movie = this.movie();
        if (!movie || !this.canEdit()) return;

        // TODO: Implementar navegación a edición
        console.log('Edit movie:', movie.title);
        this.notification.info('Edit functionality coming soon');
    }

    onShareMovie() {
        const movie = this.movie();
        if (!movie) return;

        if (navigator.share) {
            navigator.share({
                title: movie.title,
                text: `Check out this movie: ${movie.title} (${movie.yearOfRelease})`,
                url: window.location.href
            }).catch(err => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.notification.success('Movie link copied to clipboard');
            }).catch(() => {
                this.notification.error('Could not copy link');
            });
        }
    }

    onBackToMovies() {
        this.router.navigate([ROUTES.movies]);
    }

    getInteractiveStars(currentRating: number): { filled: boolean; value: number }[] {
        return Array.from({ length: 5 }, (_, index) => ({
            filled: index < currentRating,
            value: index + 1
        }));
    }
}