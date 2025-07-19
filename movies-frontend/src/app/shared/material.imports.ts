/**
 * Imports centralizados de Angular Material
 * Evita duplicación de código y facilita el mantenimiento
 */

// Core Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

/**
 * Imports básicos para cualquier componente
 */
export const CORE_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule
] as const;

/**
 * Imports de Angular Material más comunes
 */
export const MATERIAL_IMPORTS = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatChipsModule,
  MatDividerModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatTooltipModule
] as const;

/**
 * Imports para formularios avanzados
 */
export const FORM_IMPORTS = [
  ...MATERIAL_IMPORTS,
  MatDialogModule,
  MatSliderModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule
] as const;

/**
 * Imports para layouts complejos
 */
export const LAYOUT_IMPORTS = [
  ...MATERIAL_IMPORTS,
  MatExpansionModule,
  MatListModule,
  MatSidenavModule
] as const;

/**
 * Todos los imports de Material (para casos especiales)
 */
export const ALL_MATERIAL_IMPORTS = [
  ...CORE_IMPORTS,
  ...LAYOUT_IMPORTS,
  MatDialogModule,
  MatSliderModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule
] as const;