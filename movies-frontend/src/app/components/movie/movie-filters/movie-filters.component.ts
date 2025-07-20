import { Component, Input, Output, EventEmitter, signal, inject, effect, OnDestroy } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CORE_IMPORTS, MATERIAL_IMPORTS, LanguageService, MessagesService } from '../../../shared';
import { SORT_OPTIONS } from '../../../shared/utils/movie.utils';

/**
 * Interfaz para los filtros de películas
 */
export interface MovieFilters {
  title?: string;
  year?: number | null;
  sortBy?: string;
}

/**
 * Componente reutilizable para filtros de películas
 */
@Component({
  selector: 'app-movie-filters',
  standalone: true,
  imports: [
    ...CORE_IMPORTS,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './movie-filters.component.html',
  styleUrl: './movie-filters.component.scss'
})
export class MovieFiltersComponent implements OnDestroy {
  readonly languageService = inject(LanguageService);
  readonly messagesService = inject(MessagesService);

  @Input() initialFilters: MovieFilters = {};
  @Output() onApplyFilters = new EventEmitter<MovieFilters>();
  @Output() onClearFilters = new EventEmitter<void>();

  readonly filters = signal<MovieFilters>({});
  readonly sortOptions = SORT_OPTIONS;
  readonly isSearching = signal(false);

  readonly generalMessages = this.messagesService.general;

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.updateFilter('title', searchTerm.trim() || undefined);
      this.triggerSearch();
    });
  }

  ngOnInit() {
    this.filters.set({ ...this.initialFilters });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Actualiza un filtro específico
   */
  updateFilter(key: keyof MovieFilters, value: any) {
    this.filters.update(current => ({
      ...current,
      [key]: value
    }));
  }

  /**
   * Maneja la búsqueda por título con debounce
   */
  onTitleSearch(searchTerm: string) {
    this.isSearching.set(true);
    this.searchSubject.next(searchTerm);
  }

  /**
   * Dispara la búsqueda automáticamente
   */
  private triggerSearch() {
    this.isSearching.set(false);
    this.onApplyFilters.emit(this.filters());
  }

  /**
   * Maneja cambios inmediatos (año, ordenamiento)
   */
  onImmediateFilterChange(key: keyof MovieFilters, value: any) {
    this.updateFilter(key, value);
    this.onApplyFilters.emit(this.filters());
  }

  /**
   * Remueve un filtro específico y aplica la búsqueda automáticamente
   */
  removeFilter(key: keyof MovieFilters) {
    this.filters.update(current => {
      const updated = { ...current };
      if (key === 'sortBy') {
        updated[key] = 'title';
      } else {
        delete updated[key];
      }
      return updated;
    });
    this.onApplyFilters.emit(this.filters());
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters() {
    this.filters.set({ sortBy: 'title' });
    this.onClearFilters.emit();
  }

  /**
   * Verifica si hay filtros activos
   */
  hasActiveFilters(): boolean {
    const current = this.filters();
    return !!(current.title || current.year || (current.sortBy && current.sortBy !== 'title'));
  }

  /**
   * Obtiene la etiqueta de ordenamiento en el idioma actual
   */
  getSortLabel(sortBy: string): string {
    const isSpanish = this.languageService.isSpanish();

    // Mapeo de etiquetas multiidioma
    const labels: Record<string, { es: string; en: string }> = {
      'title': { es: 'Título', en: 'Title' },
      'yearOfRelease': { es: 'Año', en: 'Year' },
      'rating': { es: 'Calificación', en: 'Rating' },
      'userRating': { es: 'Mi Calificación', en: 'My Rating' }
    };

    const labelMap = labels[sortBy];
    if (labelMap) {
      return isSpanish ? labelMap.es : labelMap.en;
    }

    const option = this.sortOptions.find(opt => opt.value === sortBy);
    return option?.label || sortBy;
  }
}