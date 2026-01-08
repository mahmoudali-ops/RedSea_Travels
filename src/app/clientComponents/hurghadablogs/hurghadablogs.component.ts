import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hurghadablogs',
  standalone: true,
  imports: [],
  templateUrl: './hurghadablogs.component.html',
  styleUrl: './hurghadablogs.component.css'
})
export class HurghadablogsComponent {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {

    this.title.setTitle(
      'Hurghada Tours Blog | RedSea Tours – Best Excursions & Travel Tips'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'Discover Hurghada tours and excursions with RedSea Tours. Read travel blogs about Red Sea islands, snorkeling trips, desert safaris, boat tours, and insider travel tips in Hurghada.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'Hurghada tours blog, Hurghada excursions, Red Sea islands Hurghada, snorkeling Hurghada, desert safari Hurghada, boat trips Hurghada, RedSea Tours Hurghada'
    });
  }
}
