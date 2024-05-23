import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { FilterPage } from './filter/filter.page';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  costoProduccion: number;
  margenBeneficio: number;
  impuestos: number;
  pvp: number = null;
  content_loaded: boolean = false;
 

  constructor(
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,
    
  )
  
   { 
     // Simula la carga del contenido
     setTimeout(() => {
      this.content_loaded = true;
    }, 2000);
    
  }

  ngOnInit() {


}

}