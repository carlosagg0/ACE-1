import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  txt_usuario:string="";
  txt_cedula:string="";
  txt_clave:string="";
  clave:string="";


  current_year: number = new Date().getFullYear();

  signin_form: FormGroup;
  submit_attempt: boolean = false;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    

    // Setup form
    this.signin_form = this.formBuilder.group({
      cedula: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      clave: ['', Validators.compose([Validators.minLength(4), Validators.required])]
    });
  
  }

  // Sign in
  /*async login() {

    this.submit_attempt = true;

    // If email or password empty
    if (this.signin_form.value.txt_cedula == '' || this.signin_form.value.txt_clave == '') {
      this.toastService.presentToast('Error', 'Please input email and password', 'top', 'danger', 2000);

    } else {

      // Proceed with loading overlay
      const loading = await this.loadingController.create({
        cssClass: 'default-loading',
        message: '<p>Signing in...</p><span>Please be patient.</span>',
        spinner: 'crescent'
      });
      await loading.present();

      // Fake timeout
      setTimeout(async () => {
        // Sign in success
        await this.router.navigate(['/home']);
        loading.dismiss();
      }, 2000);

    }
    
  }*/

  async login(){
    let datos={
      accion:"login",
      usuario:this.txt_cedula,
      clave:this.txt_clave
    }
    this.authService.postData(datos).subscribe((res:any)=>{
      if (this.signin_form.value.cedula == '' || this.signin_form.value.clave == '') {
        this.toastService.presentToast('Error', 'Please input email and password', 'top', 'danger', 2000);
      }
    if(res.estado==true)
    {
      this.authService.creatSession('cod_persona', res.persona[0].codigo);
      this.authService.creatSession('persona', res.persona[0].nombre+" "+res.persona[0].apellido);
      this.authService.showToast2('Bienvenido');
      this.router.navigate(['/home']);
    }
    
    else
    {
      this.authService.showToast(res.mensaje);
    }
  
    });
    
    

  }
}
