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
      this.authService.signOut();
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
            const inputElement = document.createElement('input');
      inputElement.type = 'file';
      inputElement.accept = 'image/*'; // Acepta solo archivos de imagen
      inputElement.click(); // Hace clic en el elemento de entrada para abrir el selector de archivos
  
      // Maneja el cambio de archivo cuando se selecciona una imagen
      inputElement.addEventListener('change', async (event: any) => {
        const file = event.target.files[0];
        if (file) {
          // Aquí puedes implementar la lógica para procesar la imagen seleccionada y actualizar la foto de perfil
          // Por ejemplo, puedes mostrar una vista previa de la imagen seleccionada antes de cargarla o guardarla
          const reader = new FileReader();
          reader.onload = async (e: any) => {
            const imageSrc = e.target.result;
            // Ahora puedes utilizar imageSrc para mostrar una vista previa de la imagen seleccionada o cargarla a un servidor
            // Por ejemplo:
            // this.profilePicturePreview = imageSrc; // Actualiza la vista previa de la foto de perfil
            // Luego, puedes cargar la imagen al servidor utilizando una solicitud HTTP
          };
          reader.readAsDataURL(file); // Lee el archivo como una URL de datos
        }
      });
            
          }
        },
        {
          text: 'Tomar foto',
          icon: 'camera',
          handler: () => {
            
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