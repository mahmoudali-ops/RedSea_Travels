import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeService } from './core/services/home.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TourSiteClient';
  private homeService = inject(HomeService);

  ngOnInit() {
    this.homeService.loadHomePage();
  }
}
