import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CORE_IMPORTS, MATERIAL_IMPORTS, MessagesService, LanguageService } from '../../../shared';
import { Movie } from '../../../models/movie.model';
import { AuthService } from '../../../services/auth.service';
import { getGenreColor, getStarsArray, formatYear } from '../../../shared/utils/movie.utils';

/**
 * Componente reutilizable para mostrar una tarjeta de película
 * Evita duplicación de código en diferentes vistas
 */
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    ...CORE_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  readonly authService = inject(AuthService);
  private readonly messagesService = inject(MessagesService);
  readonly languageService = inject(LanguageService);

  @Input({ required: true }) movie!: Movie;
  @Input() elevated = true;
  @Input() showMenu = true;
  @Input() showRateButton = true;

  @Output() onRate = new EventEmitter<{ movieId: string; rating: number }>();
  @Output() onViewDetails = new EventEmitter<Movie>();
  @Output() onShare = new EventEmitter<Movie>();
  @Output() onFavorite = new EventEmitter<Movie>();

  // Mensajes reactivos disponibles en el template
  readonly messages = this.messagesService.movies;
  readonly generalMessages = this.messagesService.general;

  // Utilidades disponibles en el template
  readonly getGenreColor = getGenreColor;
  readonly getStarsArray = getStarsArray;
  readonly formatYear = formatYear;
}