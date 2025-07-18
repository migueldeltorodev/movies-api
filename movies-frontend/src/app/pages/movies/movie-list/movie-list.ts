import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movie-list',
  imports: [],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {

}
