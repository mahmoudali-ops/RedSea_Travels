import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-marsaalamblogs',
  standalone: true,
  imports: [],
  templateUrl: './marsaalamblogs.component.html',
  styleUrl: './marsaalamblogs.component.css'
})
export class MarsaalamblogsComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {

    this.title.setTitle(
      'Marsa Alam Tours Blog | RedSea Tours – Nature & Diving Adventures'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'Explore Marsa Alam tours with RedSea Tours. Read blogs about diving spots, snorkeling reefs, turtle beaches, desert adventures, and eco-friendly tours in Marsa Alam, Egypt.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'Marsa Alam tours blog, Marsa Alam diving, snorkeling Marsa Alam, turtle beach Marsa Alam, eco tours Egypt, RedSea Tours Marsa Alam'
    });
  }
}
