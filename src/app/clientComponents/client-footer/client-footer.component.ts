import { Component, inject } from '@angular/core';
import { HomeService } from '../../core/services/home.service';

@Component({
  selector: 'app-client-footer',
  standalone: true,
  imports: [],
  templateUrl: './client-footer.component.html',
  styleUrl: './client-footer.component.css'
})
export class ClientFooterComponent {
    homeService = inject(HomeService);
  

}
