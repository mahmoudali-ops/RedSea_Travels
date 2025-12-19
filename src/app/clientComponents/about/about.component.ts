import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAbout } from '../../core/interfaces/iabout';
import { AboutService } from '../../core/services/about.service';

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


  ngOnInit(): void {
    
    this.DataSUbs.set( this.aboutservice.getAboutPage().subscribe({
       next:(res)=>{
         this.AboutPageContent.set(res);
         console.log(res);
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
