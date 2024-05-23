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

 async filter() {

    // Open filter modal
    const modal = await this.modalController.create({
      component: FilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }

  calcularPVP() {
    if (this.costoProduccion && this.margenBeneficio && this.impuestos) {
      const beneficio = this.costoProduccion * (this.margenBeneficio / 100);
      const impuesto = this.costoProduccion * (this.impuestos / 100);
      this.pvp = this.costoProduccion + beneficio + impuesto;
    }
  }
}
