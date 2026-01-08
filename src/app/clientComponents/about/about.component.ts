import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAbout } from '../../core/interfaces/iabout';
import { AboutService } from '../../core/services/about.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {

    private readonly aboutservice=inject(AboutService);
    AboutPageContent:WritableSignal<IAbout|null>=signal(null);  
    DataSUbs:WritableSignal<Subscription|null>=signal(null);
    private readonly title = inject(Title);
    private readonly meta = inject(Meta);
    


  ngOnInit(): void {
    this.title.setTitle(
      'About RedSea Tours | Trusted Travel Agency in Hurghada, Egypt'
    );
  
    this.meta.updateTag({
      name: 'description',
      content:
        'RedSea Tours is a trusted travel agency in Hurghada, Egypt, specializing in Red Sea excursions, desert safaris, island trips, and private tours across Egypt with experienced local guides.'
    });
  
    this.meta.updateTag({
      name: 'keywords',
      content:
        'RedSea Tours, Hurghada travel agency, Red Sea tours, Hurghada excursions, Egypt travel company, desert safari Hurghada, island trips Hurghada'
    });

    this.DataSUbs.set( this.aboutservice.getAboutPage().subscribe({
       next:(res)=>{
         this.AboutPageContent.set(res);
       },
       error:(err)=>{
         console.log(err);
       }
     }));
  }
  
  ngOnDestroy(): void {
    if(this.DataSUbs()){
      this.DataSUbs()?.unsubscribe();
    }

  }

}
