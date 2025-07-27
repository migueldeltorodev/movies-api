import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CORE_IMPORTS, MATERIAL_IMPORTS } from '../../../shared';

@Component({
    selector: 'app-interactive-rating',
    standalone: true,
    imports: [
        ...CORE_IMPORTS,
        ...MATERIAL_IMPORTS
    ],
    templateUrl: './interactive-rating.component.html',
    styleUrl: './interactive-rating.component.scss'
})
export class InteractiveRatingComponent {
    @Input() currentRating: number = 0;
    @Input() disabled: boolean = false;
    @Input() readonly: boolean = false;
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() showRemoveButton: boolean = true;
    @Input() showRatingText: boolean = true;

    @Output() ratingChange = new EventEmitter<number>();
    @Output() ratingRemove = new EventEmitter<void>();

    readonly hoveredRating = signal<number>(0);
    readonly isHovering = signal<boolean>(false);

    readonly displayRating = computed(() => {
        return this.isHovering() ? this.hoveredRating() : this.currentRating;
    });

    readonly stars = computed(() => {
        const rating = this.displayRating();
        return Array.from({ length: 5 }, (_, index) => ({
            index: index + 1,
            filled: index < rating,
            isHovered: this.isHovering() && index < this.hoveredRating()
        }));
    });

    readonly canRemove = computed(() => {
        return this.showRemoveButton && this.currentRating > 0 && !this.disabled && !this.readonly;
    });

    readonly sizeClass = computed(() => `rating-${this.size}`);

    onStarClick(rating: number) {
        if (this.disabled || this.readonly) return;
        this.ratingChange.emit(rating);
    }

    onStarHover(rating: number) {
        if (this.disabled || this.readonly) return;
        this.hoveredRating.set(rating);
        this.isHovering.set(true);
    }

    onMouseLeave() {
        this.isHovering.set(false);
        this.hoveredRating.set(0);
    }

    onRemoveRating() {
        if (this.disabled || this.readonly) return;
        this.ratingRemove.emit();
    }

    getRatingText(rating: number): string {
        const ratingTexts: Record<number, string> = {
            1: 'Muy mala',
            2: 'Mala',
            3: 'Regular',
            4: 'Buena',
            5: 'Excelente'
        };
        return ratingTexts[rating] || 'Sin calificar';
    }
}