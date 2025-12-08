import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { TransferService } from '../../core/services/transfer.service';
import { ItransferWithPrices } from '../../core/interfaces/itransfer';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-transfers-detail',
  standalone: true,
  imports: [],
  templateUrl: './transfers-detail.component.html',
  styleUrl: './transfers-detail.component.css'
})
export class TransfersDetailComponent implements OnInit, OnDestroy {

  // DetailedTransfer:ItransferWithPrices|null=null;
  DetailedTransfer:WritableSignal<ItransferWithPrices|null>=signal(null);
  TransferSubs:WritableSignal<Subscription|null>=signal(null);


  private readonly TransferService=inject(TransferService);
  
  private readonly activeRouete=inject(ActivatedRoute);




  ngOnInit(): void {

    this.activeRouete.paramMap.subscribe({
      next:(p)=>{
        let  id=Number(p.get('id'));

        // Must call API here
       this.TransferSubs.set( this.TransferService.getDetaildedTransfers(id).subscribe({
            next:(res)=>{
             
              console.log(res);
              this.DetailedTransfer.set(res);
            },
            error:(err:HttpErrorResponse)=>{
              console.log(err.message);
            }
          }));
        
      }
    });
    
  }

  ngOnDestroy(): void {
    if(this.TransferSubs()){
      this.TransferSubs()?.unsubscribe();
    }
  }

  


}
