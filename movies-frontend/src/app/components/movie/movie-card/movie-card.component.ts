import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CORE_IMPORTS, MATERIAL_IMPORTS, MessagesService } from '../../../shared';
import { Movie, MovieStatus } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { getGenreColor, getStarsArray, formatYear, formatDuration, getMovieStatus, getStatusName } from '../../../shared/utils/movie.utils';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    ...CORE_IMPORTS,
    ...MATERIAL_IMPORTS,
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  readonly authService = inject(AuthService);
  private readonly messagesService = inject(MessagesService);


  @Input({ required: true }) movie!: Movie;
  @Input() elevated = true;
  @Input() showMenu = true;
  @Input() showRateButton = true;
  @Input() showStatus = false;
  @Input() compact = false;

  @Output() onRate = new EventEmitter<{ movieId: string; rating: number }>();
  @Output() onRemoveRating = new EventEmitter<Movie>();
  @Output() onViewDetails = new EventEmitter<Movie>();
  @Output() onShare = new EventEmitter<Movie>();
  @Output() onFavorite = new EventEmitter<Movie>();
  @Output() onEdit = new EventEmitter<Movie>();
  @Output() onChangeStatus = new EventEmitter<{ movie: Movie; status: MovieStatus }>();

  readonly messages = this.messagesService.movies;
  readonly generalMessages = this.messagesService.general;

  readonly getGenreColor = getGenreColor;
  readonly getStarsArray = getStarsArray;
  readonly formatYear = formatYear;
  readonly MovieStatus = MovieStatus;
  readonly formatDuration = formatDuration;
  readonly getMovieStatus = getMovieStatus;
  readonly getStatusName = getStatusName;

  get displayGenres(): string[] {
    return this.movie.genres.slice(0, 3);
  }

  get hasMoreGenres(): boolean {
    return this.movie.genres.length > 3;
  }

  get additionalGenresCount(): number {
    return Math.max(0, this.movie.genres.length - 3);
  }

  get canEdit(): boolean {
    return this.authService.isAdmin();
  }

  get shouldShowStatus(): boolean {
    return this.showStatus && this.authService.isAdmin();
  }

  getStatusClass(status: number): string {
    switch (status) {
      case MovieStatus.Published:
        return 'status-published';
      case MovieStatus.Draft:
        return 'status-draft';
      case MovieStatus.Archived:
        return 'status-archived';
      default:
        return 'status-unknown';
    }
  }
}