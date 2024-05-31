import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { HttpClient } from '@angular/common/http'; // Asegúrate de importar HttpClient
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listacostos',
  templateUrl: './listacostos.page.html',
  styleUrls: ['./listacostos.page.scss'],
})
export class ListacostosPage implements OnInit {
  codigo: string = '';
  productos: any = [];
  formVisible = false;
  Productos = [...this.productos];
  searchTerm: string = '';
  constructor(
    private helperService: HelperService, 
    private http: HttpClient,
    private alertController: AlertController,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {
    this.authService.getSession('codigo').then((res: any) => {
      this.codigo=res,
      this.lproductos(this.codigo)
    });
  }

  ngOnInit() {
  }
  
  lproductos(codigo: string){
    let datos = {
      accion:"lproductos",
      cod_persona: this.codigo,

    }
    this.authService.postData(datos).subscribe((res:any) => {
      if(res.estado == true) {
        this.productos = res.datos
      } else {
        this.productos.showToast(res.mensaje)
      }
    });
    
  }
  filterProductos(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.Productos = this.productos.filter((producto: any) => {
      return producto.nombre.toLowerCase().includes(searchTerm);
    });

}
editarProducto(producto: any) {
  // Implementa la lógica para editar el producto
  console.log('Editar producto', producto);
  // Por ejemplo, podrías navegar a una página de edición pasando el producto como parámetro
  this.router.navigate(['/editar-producto', producto.id]);
}

async eliminarProducto(productoId: string) {
  const alert = await this.alertController.create({
    header: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar este producto?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancelado');
        }
      },
      {
        text: 'Eliminar',
        handler: async () => {
          let datos = {
            accion: "eliminarProducto",
            productoId: productoId,
            cod_persona: this.codigo,
          };

          try {
            const res: any = await this.authService.postData(datos).toPromise();
            if (res.estado) {
            //  this.toastService.showToast("Producto eliminado con éxito");
              this.lproductos(this.codigo); // Actualiza la lista de productos
            } else {
              this.authService.showToast(res.mensaje);
            }
          } catch (error) {
            this.authService.showToast('Error al eliminar el producto. Por favor, intenta de nuevo.');
          }
        }
      }
    ]
  });

  await alert.present();
}
}