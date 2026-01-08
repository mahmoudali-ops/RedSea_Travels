import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {

    this.title.setTitle(
      'Customer Reviews | RedSea Tours – Trusted Travel Experiences in Hurghada'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'Read real customer reviews about RedSea Tours in Hurghada. Discover authentic travel experiences, Red Sea excursions, island trips, and desert safaris shared by our happy travelers.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'RedSea Tours reviews, Hurghada tour reviews, Red Sea excursions отзывы, Egypt travel reviews, Hurghada safari reviews, island trips Hurghada reviews'
    });
  }
}
