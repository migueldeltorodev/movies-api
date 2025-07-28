import { Component, Inject, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CORE_IMPORTS, FORM_IMPORTS, MessagesService } from '../../../shared';
import { Movie, CreateMovieRequest, UpdateMovieRequest, MovieStatus } from '../../../models';
import { MoviesApiService } from '../../../services/movies-api.service';
import { finalize } from 'rxjs';

export interface MovieFormModalData {
    movie?: Movie;
    mode: 'create' | 'edit';
}

@Component({
    selector: 'app-movie-form-modal',
    standalone: true,
    imports: [
        ...CORE_IMPORTS,
        ...FORM_IMPORTS
    ],
    templateUrl: './movie-form-modal.component.html',
    styleUrl: './movie-form-modal.component.scss'
})
export class MovieFormModalComponent {
    private readonly fb = inject(FormBuilder);
    private readonly moviesApi = inject(MoviesApiService);
    private readonly messagesService = inject(MessagesService);
    private readonly dialogRef = inject(MatDialogRef<MovieFormModalComponent>);

    readonly data = inject<MovieFormModalData>(MAT_DIALOG_DATA);
    readonly messages = this.messagesService.movies;
    readonly generalMessages = this.messagesService.general;
    readonly validationMessages = this.messagesService.validation;

    readonly isLoading = signal(false);
    readonly isEditMode = computed(() => this.data.mode === 'edit');
    readonly modalTitle = computed(() =>
        this.isEditMode() ? this.messages().editMovie : this.messages().createMovie
    );

    readonly movieForm: FormGroup;

    readonly ageRatingOptions = [
        { value: 'G', label: this.messages().ageRatingG },
        { value: 'PG', label: this.messages().ageRatingPG },
        { value: 'PG-13', label: this.messages().ageRatingPG13 },
        { value: 'R', label: this.messages().ageRatingR },
        { value: 'NC-17', label: this.messages().ageRatingNC17 }
    ];

    readonly statusOptions = [
        { value: MovieStatus.Draft, label: this.messages().draft },
        { value: MovieStatus.Published, label: this.messages().published },
        { value: MovieStatus.Archived, label: this.messages().archived }
    ];

    constructor() {
        this.movieForm = this.createForm();

        if (this.data.movie) {
            this.populateForm(this.data.movie);
        }
    }

    private createForm(): FormGroup {
        return this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(200)]],
            description: ['', [Validators.required, Validators.maxLength(1000)]],
            director: ['', [Validators.maxLength(100)]],
            yearOfRelease: [new Date().getFullYear(), [
                Validators.required,
                Validators.min(1900),
                Validators.max(new Date().getFullYear() + 5)
            ]],
            durationMinutes: ['', [Validators.min(1), Validators.max(600)]],
            releaseDate: [''],
            country: ['', [Validators.maxLength(100)]],
            originalLanguage: ['', [Validators.maxLength(50)]],
            ageRating: [''],
            genres: ['', [Validators.required]],
            status: [this.isEditMode() ? this.data.movie?.status : MovieStatus.Draft]
        });
    }

    private populateForm(movie: Movie): void {
        this.movieForm.patchValue({
            title: movie.title,
            description: movie.description,
            director: movie.director || '',
            yearOfRelease: movie.yearOfRelease,
            durationMinutes: movie.durationMinutes || '',
            releaseDate: movie.releaseDate || '',
            country: movie.country || '',
            originalLanguage: movie.originalLanguage || '',
            ageRating: movie.ageRating || '',
            genres: movie.genres.join(', '),
            status: movie.status
        });
    }

    onSubmit(): void {
        if (this.movieForm.invalid) {
            this.movieForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        const formValue = this.movieForm.value;

        // Process genres
        const genres = formValue.genres
            .split(',')
            .map((genre: string) => genre.trim())
            .filter((genre: string) => genre.length > 0);

        if (this.isEditMode()) {
            this.updateMovie(formValue, genres);
        } else {
            this.createMovie(formValue, genres);
        }
    }

    private createMovie(formValue: any, genres: string[]): void {
        const request: CreateMovieRequest = {
            title: formValue.title,
            description: formValue.description,
            yearOfRelease: formValue.yearOfRelease,
            director: formValue.director || undefined,
            durationMinutes: formValue.durationMinutes || undefined,
            releaseDate: formValue.releaseDate || undefined,
            country: formValue.country || undefined,
            originalLanguage: formValue.originalLanguage || undefined,
            ageRating: formValue.ageRating || undefined,
            genres
        };

        this.moviesApi.createMovie(request)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (movie) => {
                    this.dialogRef.close({ success: true, movie, action: 'create' });
                },
                error: (error) => {
                    console.error('Error creating movie:', error);
                    // Handle validation errors if needed
                }
            });
    }

    private updateMovie(formValue: any, genres: string[]): void {
        const request: UpdateMovieRequest = {
            title: formValue.title,
            description: formValue.description,
            yearOfRelease: formValue.yearOfRelease,
            director: formValue.director || undefined,
            durationMinutes: formValue.durationMinutes || undefined,
            releaseDate: formValue.releaseDate || undefined,
            country: formValue.country || undefined,
            originalLanguage: formValue.originalLanguage || undefined,
            ageRating: formValue.ageRating || undefined,
            status: formValue.status,
            genres
        };

        this.moviesApi.updateMovie(this.data.movie!.id, request)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (movie) => {
                    this.dialogRef.close({ success: true, movie, action: 'update' });
                },
                error: (error) => {
                    console.error('Error updating movie:', error);
                    // Handle validation errors if needed
                }
            });
    }

    onCancel(): void {
        this.dialogRef.close({ success: false });
    }

    getFieldError(fieldName: string): string | null {
        const field = this.movieForm.get(fieldName);
        if (field?.errors && field.touched) {
            const errors = field.errors;

            if (errors['required']) return this.validationMessages().required;
            if (errors['maxlength']) return this.validationMessages().maxLength.replace('{max}', errors['maxlength'].requiredLength);
            if (errors['min']) return this.validationMessages().min.replace('{min}', errors['min'].min);
            if (errors['max']) return this.validationMessages().max.replace('{max}', errors['max'].max);
        }

        return null;
    }

    hasFieldError(fieldName: string): boolean {
        const field = this.movieForm.get(fieldName);
        return !!(field?.errors && field.touched);
    }
}