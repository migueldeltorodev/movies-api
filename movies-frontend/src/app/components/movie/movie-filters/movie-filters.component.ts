import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CORE_IMPORTS, MATERIAL_IMPORTS } from '../../../shared/material.imports';
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
export class MovieFiltersComponent {
  @Input() initialFilters: MovieFilters = {};
  @Output() onApplyFilters = new EventEmitter<MovieFilters>();
  @Output() onClearFilters = new EventEmitter<void>();

  readonly filters = signal<MovieFilters>({});
  readonly sortOptions = SORT_OPTIONS;

  ngOnInit() {
    this.filters.set({ ...this.initialFilters });
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
   * Remueve un filtro específico
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
   * Obtiene la etiqueta de ordenamiento
   */
  getSortLabel(sortBy: string): string {
    const option = this.sortOptions.find(opt => opt.value === sortBy);
    return option?.label || sortBy;
  }
}