import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { FilterPage } from './filter/filter.page';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  materiaPrima: number;
  costoFabricacion: number;
  costoDistribucion: number;
  margenBeneficio: number;
  impuestos: number;
  otrosGastos: number;
  pvp: number = null;
  content_loaded: boolean = false;
 

  constructor() {
    // Simula la carga del contenido
    setTimeout(() => {
      this.content_loaded = true;
    }, 2000);
  }

  ngOnInit() {
    this.materiaPrima = 0;
    this.costoFabricacion = 0;
    this.costoDistribucion = 0;
    this.margenBeneficio = 0;
    this.impuestos = 0;
    this.otrosGastos = 0;
  }

  ngDoCheck() {
    this.calcularPVP();
  }

  calcularPVP() {
    const costoTotalProduccion = this.materiaPrima + this.costoFabricacion + this.costoDistribucion + this.otrosGastos;
    const beneficio = costoTotalProduccion * (this.margenBeneficio / 100);
    const impuestosCalculados = (costoTotalProduccion + beneficio) * (this.impuestos / 100);
    this.pvp = costoTotalProduccion + beneficio + impuestosCalculados;
  }

  filter() {
    console.log('Filter button clicked');
  }
}