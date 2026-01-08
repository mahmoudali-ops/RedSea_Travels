import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {

    this.title.setTitle(
      'Travel Blogs | RedSea Tours – Hurghada Travel Tips & Guides'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'Explore the RedSea Tours blog for travel tips, destination guides, Red Sea excursions, desert adventures, and insider experiences in Hurghada and across Egypt.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'RedSea Tours blog, Hurghada travel blog, Red Sea travel tips, Egypt travel guide, Hurghada excursions, desert safari Egypt, island trips Hurghada'
    });
  }
}
