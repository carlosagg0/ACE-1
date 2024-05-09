import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  edit_profile_form: FormGroup;
  submit_attempt: boolean = false;

  txt_nombre:string="";
  txt_apellido:string="";
  txt_cedula:string="";
  persona: string="";
  correo: string="";
  nombre: string="";
  apellido: string="";
  cedula: string="";


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private navController: NavController,
    private actionSheetController: ActionSheetController,
    private router: Router) { 
        
      this.authService.getSession('persona').then((res:any)=>{
        this.persona=res;
        
        });
      this.authService.getSession('correo').then((res:any)=>{
          this.correo=res;
          
          });
          this.authService.getSession('nombre').then((res:any)=>{
            this.nombre=res;
            
            });
            this.authService.getSession('apellido').then((res:any)=>{
              this.apellido=res;
              
              });
              this.authService.getSession('cedula').then((res:any)=>{
                this.cedula=res;
                
                });
        }

  ngOnInit() {

    // Setup form
    this.edit_profile_form = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required]
    });


  }

  async actnombre()
  {
    let datos={
      accion:"actnombre",
      cedula:this.cedula,
      nombre:this.txt_nombre,
      apellido:this.txt_apellido,
    }

    this.authService.postData(datos).subscribe((res:any)=>{
      
    if(res.estado==true)
    {
      this.authService.showToast2(res.mensaje2);
      this.router.navigate(['/home']);
    }
    
    else
    {
      this.authService.showToast(res.mensaje);
    }
  
    });
}

  // Update profile picture
  async updateProfilePicture() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Elija una foto existente o tome una nueva',
      cssClass: 'custom-action-sheet',
      buttons: [
        {
          text: 'Elegir de la galería',
          icon: 'images',
          handler: () => {
            // Put in logic ...
          }
        },
        {
          text: 'Tomar foto',
          icon: 'camera',
          handler: () => {
            // Put in logic ...
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }

  // Submit form
  submit() {

    this.submit_attempt = true;

    // If form valid
    if (this.edit_profile_form.valid) {

      // Save form ...

      // Display success message and go back
      this.toastService.presentToast('Guardado', 'Perfil guardado correctamente', 'top', 'success', 2000);
      this.navController.back();

    } else {

      // Display error message
      this.toastService.presentToast('Error', 'Por favor, llene todos los campos', 'top', 'danger', 2000);
    }
  }

}